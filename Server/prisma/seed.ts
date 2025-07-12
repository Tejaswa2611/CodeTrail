import { PrismaClient, Platform } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create test users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const user1 = await prisma.user.upsert({
    where: { email: 'john.doe@example.com' },
    update: {},
    create: {
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: hashedPassword,
      isEmailVerified: true,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'jane.smith@example.com' },
    update: {},
    create: {
      email: 'jane.smith@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      password: hashedPassword,
      isEmailVerified: true,
    },
  });

  console.log('✅ Created test users');

  // Create platform profiles
  const profiles = [
    {
      userId: user1.id,
      platform: Platform.leetcode,
      handle: 'john_leetcode',
      currentRating: null,
      maxRating: null,
      syncedAt: new Date(),
    },
    {
      userId: user1.id,
      platform: Platform.codeforces,
      handle: 'john_cf',
      currentRating: 1542,
      maxRating: 1687,
      rank: 'Expert',
      syncedAt: new Date(),
    },
    {
      userId: user2.id,
      platform: Platform.leetcode,
      handle: 'jane_leetcode',
      currentRating: null,
      maxRating: null,
      syncedAt: new Date(),
    },
  ];

  for (const profile of profiles) {
    await prisma.platformProfile.upsert({
      where: {
        userId_platform: {
          userId: profile.userId,
          platform: profile.platform,
        },
      },
      update: profile,
      create: profile,
    });
  }

  console.log('✅ Created platform profiles');

  // Create sample problems
  const problems = [
    {
      platform: Platform.leetcode,
      externalId: 'two-sum',
      name: 'Two Sum',
      difficulty: 'easy',
      tags: ['array', 'hash-table'],
      url: 'https://leetcode.com/problems/two-sum/',
    },
    {
      platform: Platform.leetcode,
      externalId: 'add-two-numbers',
      name: 'Add Two Numbers',
      difficulty: 'medium',
      tags: ['linked-list', 'math', 'recursion'],
      url: 'https://leetcode.com/problems/add-two-numbers/',
    },
    {
      platform: Platform.codeforces,
      externalId: '1-A',
      name: 'Theatre Square',
      difficulty: 'easy',
      rating: 1000,
      tags: ['math', 'constructive-algorithms'],
      url: 'https://codeforces.com/problemset/problem/1/A',
    },
    {
      platform: Platform.codeforces,
      externalId: '4-A',
      name: 'Watermelon',
      difficulty: 'easy',
      rating: 800,
      tags: ['brute-force', 'math'],
      url: 'https://codeforces.com/problemset/problem/4/A',
    },
  ];

  for (const problem of problems) {
    await prisma.problem.upsert({
      where: {
        platform_externalId: {
          platform: problem.platform,
          externalId: problem.externalId,
        },
      },
      update: problem,
      create: problem,
    });
  }

  console.log('✅ Created sample problems');

  // Get problem IDs for submissions
  const twoSum = await prisma.problem.findFirst({
    where: { externalId: 'two-sum' },
  });
  const theatreSquare = await prisma.problem.findFirst({
    where: { externalId: '1-A' },
  });

  // Create sample submissions
  if (twoSum && theatreSquare) {
    const submissions = [
      {
        userId: user1.id,
        platform: Platform.leetcode,
        handle: 'john_leetcode',
        problemId: twoSum.id,
        verdict: 'AC',
        language: 'Python',
        timestamp: new Date('2024-01-15T10:30:00Z'),
      },
      {
        userId: user1.id,
        platform: Platform.codeforces,
        handle: 'john_cf',
        problemId: theatreSquare.id,
        verdict: 'AC',
        language: 'C++',
        timestamp: new Date('2024-01-16T14:20:00Z'),
      },
      {
        userId: user2.id,
        platform: Platform.leetcode,
        handle: 'jane_leetcode',
        problemId: twoSum.id,
        verdict: 'WA',
        language: 'Java',
        timestamp: new Date('2024-01-17T09:15:00Z'),
      },
    ];

    for (const submission of submissions) {
      await prisma.submission.create({
        data: submission,
      });
    }

    console.log('✅ Created sample submissions');
  }

  // Create sample contests
  const contests = [
    {
      platform: Platform.leetcode,
      contestId: 'weekly-contest-380',
      name: 'Weekly Contest 380',
      startTime: new Date('2024-01-14T02:30:00Z'),
      duration: 5400, // 90 minutes
    },
    {
      platform: Platform.codeforces,
      contestId: '1912',
      name: 'Codeforces Round 916 (Div. 3)',
      startTime: new Date('2024-01-15T14:35:00Z'),
      duration: 7200, // 120 minutes
    },
  ];

  for (const contest of contests) {
    await prisma.contest.upsert({
      where: {
        platform_contestId: {
          platform: contest.platform,
          contestId: contest.contestId,
        },
      },
      update: contest,
      create: contest,
    });
  }

  console.log('✅ Created sample contests');

  // Create sample contest participation
  const participations = [
    {
      userId: user1.id,
      platform: Platform.codeforces,
      handle: 'john_cf',
      contestId: '1912',
      rank: 1245,
      oldRating: 1520,
      newRating: 1542,
      timestamp: new Date('2024-01-15T14:35:00Z'),
    },
    {
      userId: user2.id,
      platform: Platform.leetcode,
      handle: 'jane_leetcode',
      contestId: 'weekly-contest-380',
      rank: 2847,
      oldRating: null,
      newRating: null,
      timestamp: new Date('2024-01-14T02:30:00Z'),
    },
  ];

  for (const participation of participations) {
    await prisma.contestParticipation.upsert({
      where: {
        userId_platform_contestId: {
          userId: participation.userId,
          platform: participation.platform,
          contestId: participation.contestId,
        },
      },
      update: participation,
      create: participation,
    });
  }

  console.log('✅ Created sample contest participation');

  console.log('🎉 Database seeding completed successfully!');

  // Display summary
  const userCount = await prisma.user.count();
  const profileCount = await prisma.platformProfile.count();
  const problemCount = await prisma.problem.count();
  const submissionCount = await prisma.submission.count();
  const contestCount = await prisma.contest.count();
  const participationCount = await prisma.contestParticipation.count();

  console.log('\n📊 Database Summary:');
  console.log(`Users: ${userCount}`);
  console.log(`Platform Profiles: ${profileCount}`);
  console.log(`Problems: ${problemCount}`);
  console.log(`Submissions: ${submissionCount}`);
  console.log(`Contests: ${contestCount}`);
  console.log(`Contest Participations: ${participationCount}`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
