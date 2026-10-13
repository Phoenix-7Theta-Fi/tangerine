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

/**
 * End-to-end flow against real Postgres + Redis (see docker-compose.yml).
 * Covers the parts that unit tests can't: DI wiring, guards, validation,
 * persistence and the feed read path.
 */
describe('Tangerine API (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userA: string;
  let userB: string;

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
    const users = await prisma.user.findMany({ take: 2, orderBy: { id: 'asc' } });
    userA = users[0].id;
    userB = users[1].id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/health reports db and redis up', async () => {
    const res = await request(app.getHttpServer()).get('/api/health').expect(200);
    expect(res.body).toMatchObject({ db: 'up', redis: 'up' });
  });

  it('exposes pre-registered identities without auth (demo bootstrap)', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/session/identities')
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('handle');
  });

  it('rejects requests with no x-user-id header', async () => {
    await request(app.getHttpServer()).get('/api/users/me').expect(401);
  });

  it('returns the current user profile', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/users/me')
      .set('x-user-id', userA)
      .expect(200);
    expect(res.body.id).toBe(userA);
  });

  it('returns a paginated home feed with an opaque cursor', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/feed?limit=5')
      .set('x-user-id', userA)
      .expect(200);
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items.length).toBeLessThanOrEqual(5);
    if (res.body.nextCursor) {
      const page2 = await request(app.getHttpServer())
        .get(`/api/feed?limit=5&cursor=${encodeURIComponent(res.body.nextCursor)}`)
        .set('x-user-id', userA)
        .expect(200);
      const ids1 = new Set(res.body.items.map((i: { id: string }) => i.id));
      for (const item of page2.body.items) {
        expect(ids1.has(item.id)).toBe(false);
      }
    }
  });

  it('creates a post and fans it out to a follower feed', async () => {
    // userA follows userB.
    await prisma.follow.upsert({
      where: { followerId_followingId: { followerId: userA, followingId: userB } },
      create: { followerId: userA, followingId: userB },
      update: {},
    });

    const created = await request(app.getHttpServer())
      .post('/api/posts')
      .set('x-user-id', userB)
      .send({ body: 'e2e fan-out probe' })
      .expect(201);
    expect(created.body.id).toBeDefined();

    const feed = await request(app.getHttpServer())
      .get('/api/feed?limit=50')
      .set('x-user-id', userA)
      .expect(200);
    const found = feed.body.items.find(
      (i: { id: string }) => i.id === created.body.id,
    );
    expect(found).toBeDefined();
  });

  it('sends and lists chat messages', async () => {
    const conv = await request(app.getHttpServer())
      .post('/api/conversations/direct')
      .set('x-user-id', userA)
      .send({ userId: userB })
      .expect(201);

    const sent = await request(app.getHttpServer())
      .post(`/api/conversations/${conv.body.id}/messages`)
      .set('x-user-id', userA)
      .send({ body: 'hello from e2e', clientMsgId: `e2e-${Date.now()}` })
      .expect(201);
    expect(sent.body.seq).toBeGreaterThan(0);

    const list = await request(app.getHttpServer())
      .get(`/api/conversations/${conv.body.id}/messages`)
      .set('x-user-id', userA)
      .expect(200);
    expect(list.body.items.some((m: { id: string }) => m.id === sent.body.id)).toBe(
      true,
    );
  });
});
