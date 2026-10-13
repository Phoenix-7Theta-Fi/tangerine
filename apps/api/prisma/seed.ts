/* eslint-disable no-console */
import { PrismaClient, Role, ConversationType } from '@prisma/client';

const prisma = new PrismaClient();

// Demo threshold: small so the celebrity/pull path is exercised with a
// realistic-sized follower graph. Production would be ~10_000.
const CELEBRITY_THRESHOLD = Number(process.env.CELEBRITY_FOLLOWER_THRESHOLD ?? 15);

/** Deterministic PRNG so every seed run produces the same demo data. */
function mulberry32(seed: number) {
  return function random() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20261013);
const pick = <T>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];
const pickN = <T>(arr: T[], n: number): T[] => {
  const copy = [...arr];
  const out: T[] = [];
  for (let i = 0; i < n && copy.length; i++) {
    out.push(copy.splice(Math.floor(rand() * copy.length), 1)[0]);
  }
  return out;
};

interface SeedUser {
  handle: string;
  displayName: string;
  role: Role;
  headline: string;
  bio: string;
  region: string;
  verified?: boolean;
}

const MEMBERS: SeedUser[] = [
  ['maya', 'Maya Chen', 'Product designer rebuilding her sleep.', 'Berlin, DE'],
  ['drjules', 'Jules Okafor', 'Marathoner, new to strength training.', 'Lagos, NG'],
  ['samir', 'Samir Haddad', 'Managing insulin resistance day by day.', 'Amman, JO'],
  ['priya', 'Priya Ranganathan', 'Perimenopause, learning as I go.', 'Bengaluru, IN'],
  ['tommyb', 'Tommy Brennan', 'Ex-athlete, now focused on recovery.', 'Dublin, IE'],
  ['lena', 'Lena Vogt', 'Yoga teacher exploring gut health.', 'Vienna, AT'],
  ['carlos', 'Carlos Mendes', 'Busy dad trying to train consistently.', 'Lisbon, PT'],
  ['nao', 'Nao Tanaka', 'Night-shift nurse. Sleep is my project.', 'Osaka, JP'],
  ['grace', 'Grace Mwangi', 'Runner and amateur nutrition nerd.', 'Nairobi, KE'],
  ['dmitri', 'Dmitri Volkov', 'Came for the biomarkers, stayed for the habits.', 'Tallinn, EE'],
  ['aisha', 'Aisha Bello', 'Postpartum recovery and getting strong again.', 'Abuja, NG'],
  ['owen', 'Owen Price', 'Desk job, fighting the sedentary default.', 'Manchester, UK'],
  ['sophie', 'Sophie Laurent', 'Cooking my way to better labs.', 'Lyon, FR'],
  ['raj', 'Raj Patel', 'Type 2 in remission. Ask me how.', 'Toronto, CA'],
  ['mira', 'Mira Singh', 'Fertility journey, tracking everything.', 'Delhi, IN'],
  ['finn', 'Finn Larsen', 'Cyclist, borderline low ferritin.', 'Copenhagen, DK'],
  ['elena', 'Elena Petrova', 'Chronic stress? Working on it.', 'Sofia, BG'],
  ['kwame', 'Kwame Mensah', 'Building muscle in my forties.', 'Accra, GH'],
  ['isabel', 'Isabel Reyes', 'Menopause and strength training.', 'Mexico City, MX'],
  ['noah', 'Noah Bergman', 'Sleep apnoea diagnosis, adjusting.', 'Stockholm, SE'],
].map(([handle, displayName, headline, region]) => ({
  handle: handle as string,
  displayName: displayName as string,
  role: Role.MEMBER,
  headline: headline as string,
  bio: 'Using Tangerine to make sense of my health data and stay accountable.',
  region: region as string,
}));

const PRACTITIONERS: SeedUser[] = [
  ['dr.aruna', 'Dr. Aruna Krishnan', 'Endocrinologist · metabolic health', 'Bengaluru, IN', true],
  ['coach.tom', 'Tom Rivera', 'Strength & conditioning coach', 'Austin, US', true],
  ['dr.meyer', 'Dr. Hannah Meyer', 'Sleep physician · CBT-I', 'Zurich, CH', true],
  ['rd.nadia', 'Nadia Farouk, RD', 'Registered dietitian · gut health', 'Cairo, EG', true],
  ['dr.oyelaran', 'Dr. Femi Oyelaran', 'Sports medicine physician', 'London, UK', true],
  ['coach.mei', 'Mei Lin', 'Menopause fitness specialist', 'Singapore, SG', false],
  ['dr.paul', 'Dr. Paul Adeyemi', 'Cardiologist · prevention', 'Lagos, NG', false],
  ['rd.olivia', 'Olivia Grant, RD', 'Sports nutritionist', 'Melbourne, AU', false],
  ['coach.sven', 'Sven Karlsson', 'Endurance coach', 'Oslo, NO', false],
  ['dr.tara', 'Dr. Tara Nair', 'Integrative medicine', 'Mumbai, IN', false],
  ['coach.jules', 'Juliet Moreau', 'Pilates & rehab', 'Paris, FR', false],
  ['dr.kenji', 'Dr. Kenji Sato', 'Internal medicine', 'Tokyo, JP', false],
].map(([handle, displayName, headline, region, verified]) => ({
  handle: handle as string,
  displayName: displayName as string,
  role: Role.PRACTITIONER,
  headline: headline as string,
  bio: 'Evidence-based care. I share what actually moves outcomes, not what trends.',
  region: region as string,
  verified: verified as boolean,
}));

const PROVIDERS: SeedUser[] = [
  ['lab.north', 'Northwind Labs', 'Diagnostics provider', 'Rotterdam, NL'],
  ['supply.true', 'Truvita Supplements', 'Third-party tested supplements', 'Denver, US'],
  ['dev.aura', 'Aura Devices', 'Wearables & CGMs', 'Seoul, KR'],
  ['clinic.reset', 'Reset Clinic', 'Multi-disciplinary clinic', 'Dubai, AE'],
].map(([handle, displayName, headline, region]) => ({
  handle: handle as string,
  displayName: displayName as string,
  role: Role.PROVIDER,
  headline: headline as string,
  bio: 'Products and services referenced across Tangerine care plans.',
  region: region as string,
}));

const POST_BODIES = [
  'Reminder that "normal" lab ranges are population averages, not your optimal. Context matters more than the number.',
  'Three weeks of consistent protein at breakfast and my afternoon crashes are basically gone. N=1, but still.',
  'Hot take: sleep is the highest-leverage intervention and almost nobody treats it that way.',
  'Zone 2 feels boring until you realise you can hold a conversation for two hours and your recovery markers improve.',
  'Your resting heart rate trend over 90 days tells you more than any single reading.',
  'Started tracking my glucose and the biggest surprise was how much my morning coffee routine spiked it before food.',
  'Strength training in perimenopause is not optional — it is the plan.',
  'If you are chronically stressed, no supplement will outrun a nervous system that never gets to rest.',
  'Ferritin of 18 is "normal" and also why you feel exhausted on every ride. Ask for the actual number.',
  'Gut health is not one thing. It is sleep, fibre variety, stress, and time. Mostly time.',
  'The best protocol is the one you will actually do on a bad week.',
  'Recomp is slower than a cut and faster than nothing. Trust the trend line, not the daily scale.',
  'Mobility is a skill, not a stretch. Practice it daily, briefly.',
  'Protein target check: most people aiming for 1.6g/kg are landing nearer 0.9. Log it once and you will see.',
  'My most useful clinical tool is a calendar and the sentence "what changed two weeks before this started?"',
  'Consistency beats intensity for the tenth year running. Boring wins.',
  'Sodium, potassium, magnesium. If you train hard and cramp, check this before you buy anything.',
  'Deload weeks are not lost weeks. They are where the adaptation actually happens.',
  'A CGM is a mirror, not a judge. Use it to learn, not to feel bad.',
  'Fibre is the most underrated supplement and the hardest to sell.',
];

async function main() {
  console.log('Clearing existing data...');
  await prisma.message.deleteMany();
  await prisma.conversationMember.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.like.deleteMany();
  await prisma.post.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.user.deleteMany();

  console.log('Creating users...');
  const all: SeedUser[] = [...MEMBERS, ...PRACTITIONERS, ...PROVIDERS];
  const createUser = (u: SeedUser) =>
    prisma.user.create({
      data: {
        handle: u.handle,
        displayName: u.displayName,
        role: u.role,
        headline: u.headline,
        bio: u.bio,
        region: u.region,
        verified: u.verified ?? false,
        avatarUrl: `https://i.pravatar.cc/200?u=${u.handle}`,
      },
    });
  // Create the primary demo user first (awaited) so it is deterministically
  // the earliest row and thus the default identity in the switcher.
  const firstUser = await createUser(all[0]);
  const restUsers = await Promise.all(all.slice(1).map(createUser));
  const users = [firstUser, ...restUsers];

  const members = users.filter((u) => u.role === Role.MEMBER);
  const practitioners = users.filter((u) => u.role === Role.PRACTITIONER);
  // Providers tend to be followed by practitioners.
  const providers = users.filter((u) => u.role === Role.PROVIDER);

  console.log('Generating follow graph...');
  const follows: { followerId: string; followingId: string }[] = [];
  const seen = new Set<string>();
  const addFollow = (followerId: string, followingId: string) => {
    if (followerId === followingId) return;
    const key = `${followerId}:${followingId}`;
    if (seen.has(key)) return;
    seen.add(key);
    follows.push({ followerId, followingId });
  };

  // Members follow a handful of practitioners (biased toward the first few,
  // creating a skewed follower distribution -> a small number of "celebrities").
  for (const m of members) {
    const chosen = [
      ...pickN(practitioners.slice(0, 5), 1 + Math.floor(rand() * 3)),
      ...pickN(practitioners.slice(5), Math.floor(rand() * 2)),
      ...pickN(members, 1 + Math.floor(rand() * 4)),
    ];
    chosen.forEach((t) => addFollow(m.id, t.id));
  }
  // Practitioners follow each other and some providers.
  for (const p of practitioners) {
    [...pickN(practitioners, 2), ...pickN(providers, 1)].forEach((t) =>
      addFollow(p.id, t.id),
    );
  }
  // Everyone follows the two flagship clinicians to push them over the bar.
  for (const u of users) {
    if (u.id !== practitioners[0].id) addFollow(u.id, practitioners[0].id);
    if (u.id !== practitioners[1].id) addFollow(u.id, practitioners[1].id);
  }

  await prisma.follow.createMany({ data: follows });

  console.log('Recomputing follower counts...');
  for (const u of users) {
    const followerCount = follows.filter((f) => f.followingId === u.id).length;
    const followingCount = follows.filter((f) => f.followerId === u.id).length;
    await prisma.user.update({
      where: { id: u.id },
      data: {
        followerCount,
        followingCount,
        isCelebrity: followerCount >= CELEBRITY_THRESHOLD,
      },
    });
  }
  const celebrities = users.filter(
    (u) => follows.filter((f) => f.followingId === u.id).length >= CELEBRITY_THRESHOLD,
  );
  console.log(
    `  ${users.length} users, ${follows.length} follows, ${celebrities.length} celebrities (threshold ${CELEBRITY_THRESHOLD})`,
  );

  console.log('Creating posts...');
  const posts: { id: string; authorId: string }[] = [];
  let bodyIdx = 0;
  for (const u of users) {
    const count = 2 + Math.floor(rand() * 5);
    for (let i = 0; i < count; i++) {
      const body = POST_BODIES[bodyIdx++ % POST_BODIES.length];
      const daysAgo = rand() * 21;
      const createdAt = new Date(Date.now() - daysAgo * 24 * 3600 * 1000);
      const post = await prisma.post.create({
        data: {
          authorId: u.id,
          body,
          createdAt,
          likeCount: 0,
          commentCount: 0,
        },
      });
      posts.push({ id: post.id, authorId: u.id });
    }
  }

  console.log('Adding likes and comments...');
  for (const post of posts) {
    const likers = pickN(users, Math.floor(rand() * 14));
    if (likers.length) {
      await prisma.like.createMany({
        data: likers.map((l) => ({ postId: post.id, userId: l.id })),
        skipDuplicates: true,
      });
      await prisma.post.update({
        where: { id: post.id },
        data: { likeCount: likers.length },
      });
    }
    const commenters = pickN(users, Math.floor(rand() * 4));
    for (const c of commenters) {
      await prisma.comment.create({
        data: {
          postId: post.id,
          authorId: c.id,
          body: pick([
            'This is such a good point.',
            'Needed to read this today.',
            'Any resources you would recommend?',
            'Saving this, thank you.',
            'Exactly what I have been trying to explain.',
          ]),
        },
      });
    }
    await prisma.post.update({
      where: { id: post.id },
      data: { commentCount: commenters.length },
    });
  }

  console.log('Creating conversations...');
  const directPairs: [number, number][] = [
    [0, MEMBERS.length], // maya <-> dr.aruna
    [0, MEMBERS.length + 1], // maya <-> coach.tom
    [1, MEMBERS.length + 2], // drjules <-> dr.meyer
    [3, MEMBERS.length + 3], // priya <-> rd.nadia
  ];

  const scripts: Record<number, [string, string][]> = {
    // keyed by pair index; [senderRole, body] where senderRole 'self'|'other'
    0: [
      ['self', 'Hi Dr. Krishnan — my fasting glucose is creeping up and I would love to understand why.'],
      ['other', 'Happy to help. Can you share your last three fasting values and how long after waking you measure?'],
      ['self', '118, 124, 116 — all about 30 minutes after waking.'],
      ['other', 'Good, that timing is consistent. Let us look at last night\u2019s dinner and your sleep before we change anything.'],
    ],
    1: [
      ['self', 'Coach, I want to add strength training without wrecking my running.'],
      ['other', 'Two full-body sessions a week, keep them away from your long run. Start submaximal — no soreness heroics.'],
      ['self', 'That feels almost too easy.'],
      ['other', 'That is the point. We can always add load. We cannot un-injure you.'],
    ],
    2: [
      ['self', 'My sleep tracker says I am getting 7 hours but I still wake up exhausted.'],
      ['other', 'Duration is one variable. What does your wake-after-sleep and bedtime consistency look like?'],
      ['self', 'Bedtime swings between 10pm and 1am depending on shifts.'],
      ['other', 'There it is. Anchor your wake time first for two weeks, then we adjust.'],
    ],
    3: [
      ['self', 'Bloating after most meals — where do I even start?'],
      ['other', 'Let us keep it simple: same meals, tracked, for a week. Then we vary one thing at a time.'],
      ['self', 'Okay, starting tomorrow.'],
      ['other', 'Perfect. Send me the log and we will find the pattern together.'],
    ],
  };

  for (let i = 0; i < directPairs.length; i++) {
    const [aIdx, bIdx] = directPairs[i];
    const a = users[aIdx];
    const b = users[bIdx];
    const conv = await prisma.conversation.create({
      data: {
        type: ConversationType.DIRECT,
        members: {
          create: [
            { userId: a.id, lastReadSeq: 0 },
            { userId: b.id, lastReadSeq: 0 },
          ],
        },
      },
    });
    let seq = 0;
    let lastAt = new Date(Date.now() - 3600 * 1000);
    for (const [senderRole, body] of scripts[i]) {
      seq += 1;
      const senderId = senderRole === 'self' ? a.id : b.id;
      lastAt = new Date(lastAt.getTime() + 60 * 1000 * (2 + Math.floor(rand() * 10)));
      await prisma.message.create({
        data: {
          conversationId: conv.id,
          senderId,
          body,
          seq,
          createdAt: lastAt,
          clientMsgId: `seed-${conv.id}-${seq}`,
        },
      });
    }
    await prisma.conversation.update({
      where: { id: conv.id },
      data: { lastSeq: seq, lastMessageAt: lastAt },
    });
  }

  console.log('\nSeed complete.');
  console.log(`Primary demo user: @${MEMBERS[0].handle} (${users[0].id})`);
  console.log(`Celebrities: ${celebrities.map((c) => '@' + c.handle).join(', ')}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
