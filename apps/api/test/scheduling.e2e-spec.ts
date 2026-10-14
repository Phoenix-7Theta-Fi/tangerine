import { INestApplication } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { AllExceptionsFilter } from '../src/common/filters/all-exceptions.filter';
import { PrismaService } from '../src/prisma/prisma.service';

jest.setTimeout(30_000);

/**
 * Invariant tests for scheduling, against real Postgres (the exclusion
 * constraint is the thing under test — a mock cannot reproduce it).
 *
 *   1. Booking contention: M members race for one slot; exactly one wins, the
 *      rest get a clean 409.
 *   2. Reschedule idempotency: the same clientOpId twice is a single side effect.
 *   3. Hold expiry: a held slot is unavailable, then becomes bookable after its
 *      TTL without any manual release.
 */
describe('Scheduling invariants (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let practitionerId: string;
  let sessionTypeId: string;
  let members: string[];

  const http = () => request(app.getHttpServer());
  const api = '/api';

  async function firstOpenSlot(afterDays = 1): Promise<string> {
    const from = new Date(Date.now() + afterDays * 86_400_000).toISOString();
    const to = new Date(Date.now() + (afterDays + 7) * 86_400_000).toISOString();
    const res = await http()
      .get(
        `${api}/practitioners/${practitionerId}/slots?from=${from}&to=${to}&sessionTypeId=${sessionTypeId}`,
      )
      .set('x-user-id', members[0])
      .expect(200);
    const slot = (res.body.slots as { startTime: string }[])[0];
    if (!slot) throw new Error('seed produced no bookable slots');
    return slot.startTime;
  }

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );
    app.setGlobalPrefix('api');
    app.useGlobalFilters(new AllExceptionsFilter());
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
    prisma = app.get(PrismaService);

    const practitioner = await prisma.user.findFirstOrThrow({
      where: { handle: 'dr.aruna' },
    });
    practitionerId = practitioner.id;
    const sessionType = await prisma.sessionType.findFirstOrThrow({
      where: { practitionerId, name: 'Initial consult' },
    });
    sessionTypeId = sessionType.id;

    const memberRows = await prisma.user.findMany({
      where: { role: 'MEMBER' },
      orderBy: { createdAt: 'asc' },
      take: 25,
    });
    members = memberRows.map((m) => m.id);

    // Slots are chosen in the future; drop any lingering test leftovers so the
    // suite is repeatable.
    await prisma.booking.deleteMany({
      where: { practitionerId, memberId: { in: members } },
    });
  });

  afterAll(async () => {
    if (prisma) {
      await prisma.booking.deleteMany({
        where: { practitionerId, memberId: { in: members } },
      });
    }
    await app.close();
  });

  it('lets exactly one of many concurrent bookings win a slot', async () => {
    const slot = await firstOpenSlot();
    const contenders = members.slice(0, 20);

    const results = await Promise.all(
      contenders.map((memberId) =>
        http()
          .post(`${api}/bookings`)
          .set('x-user-id', memberId)
          .send({ sessionTypeId, startTime: slot })
          .then((r) => r.status),
      ),
    );

    const created = results.filter((s) => s === 201).length;
    const conflicts = results.filter((s) => s === 409).length;
    expect(created).toBe(1);
    expect(conflicts).toBe(contenders.length - 1);

    const live = await prisma.booking.count({
      where: {
        practitionerId,
        startTime: new Date(slot),
        status: { in: ['HELD', 'PENDING', 'CONFIRMED'] },
      },
    });
    expect(live).toBe(1);
  });

  it('reschedules idempotently: the same op id causes one move', async () => {
    const slotA = await firstOpenSlot(8);
    const slotB = await firstOpenSlot(16);
    const member = members[2];

    const created = await http()
      .post(`${api}/bookings`)
      .set('x-user-id', member)
      .send({ sessionTypeId, startTime: slotA })
      .expect(201);

    const opId = `resched-${Date.now()}`;
    const first = await http()
      .post(`${api}/bookings/${created.body.id}/reschedule`)
      .set('x-user-id', member)
      .send({ startTime: slotB, clientOpId: opId })
      .expect(201);
    const second = await http()
      .post(`${api}/bookings/${created.body.id}/reschedule`)
      .set('x-user-id', member)
      .send({ startTime: slotB, clientOpId: opId })
      .expect(201);

    expect(second.body.startTime).toBe(first.body.startTime);
    expect(new Date(second.body.startTime).toISOString()).toBe(
      new Date(slotB).toISOString(),
    );

    const ops = await prisma.bookingOperation.count({
      where: { userId: member, opId },
    });
    expect(ops).toBe(1);
    await prisma.booking.deleteMany({ where: { id: created.body.id } });
  });

  it('frees a held slot automatically once its TTL passes', async () => {
    const slot = await firstOpenSlot(24);
    const holder = members[4];
    const rival = members[5];

    const hold = await http()
      .post(`${api}/holds`)
      .set('x-user-id', holder)
      .send({ sessionTypeId, startTime: slot, ttlSeconds: 2 })
      .expect(201);
    expect(hold.body.status).toBe('HELD');

    // While held, the slot is unavailable to everyone else.
    const blocked = await http()
      .post(`${api}/bookings`)
      .set('x-user-id', rival)
      .send({ sessionTypeId, startTime: slot });
    expect(blocked.status).toBe(409);

    // After the TTL (plus sweep jitter), the rival can claim it — no manual release.
    const deadline = Date.now() + 8000;
    let claimed = 0;
    let lastStatus = 0;
    while (Date.now() < deadline) {
      const res = await http()
        .post(`${api}/bookings`)
        .set('x-user-id', rival)
        .send({ sessionTypeId, startTime: slot });
      lastStatus = res.status;
      if (res.status === 201) {
        claimed = res.status;
        break;
      }
      await new Promise((r) => setTimeout(r, 250));
    }
    expect(claimed).toBe(201);
    void lastStatus;

    const expired = await prisma.booking.findUnique({ where: { id: hold.body.id } });
    expect(expired?.status).toBe('CANCELLED');
  });
});
