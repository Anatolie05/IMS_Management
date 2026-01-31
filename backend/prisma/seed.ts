import { PrismaClient, UserRole, IMSStatus, PriorityLevel } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.iMSAssignmentHistory.deleteMany();
  await prisma.iMSHistory.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.attachment.deleteMany();
  await prisma.iMSRelation.deleteMany();
  await prisma.mergedIMSItem.deleteMany();
  await prisma.mergedIMS.deleteMany();
  await prisma.iMSTag.deleteMany();
  await prisma.iMS.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();

  console.log('✓ Cleared existing data');

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@ims.com',
      password: hashedPassword,
      fullName: 'Admin User',
      role: UserRole.ADMIN,
    },
  });

  const analyst1 = await prisma.user.create({
    data: {
      email: 'analyst1@ims.com',
      password: hashedPassword,
      fullName: 'John Analyst',
      role: UserRole.ANALYST,
    },
  });

  const analyst2 = await prisma.user.create({
    data: {
      email: 'analyst2@ims.com',
      password: hashedPassword,
      fullName: 'Jane Smith',
      role: UserRole.ANALYST,
    },
  });

  const viewer = await prisma.user.create({
    data: {
      email: 'viewer@ims.com',
      password: hashedPassword,
      fullName: 'Viewer User',
      role: UserRole.VIEWER,
    },
  });

  console.log('✓ Created users');

  // Create tags
  const tags = await Promise.all([
    prisma.tag.create({
      data: { name: 'Russian Influence', color: '#FF5733' },
    }),
    prisma.tag.create({
      data: { name: 'Disinformation', color: '#C70039' },
    }),
    prisma.tag.create({
      data: { name: 'Cyber Operations', color: '#900C3F' },
    }),
    prisma.tag.create({
      data: { name: 'Political', color: '#581845' },
    }),
    prisma.tag.create({
      data: { name: 'Social Media', color: '#FFC300' },
    }),
    prisma.tag.create({
      data: { name: 'Election Interference', color: '#DAF7A6' },
    }),
  ]);

  console.log('✓ Created tags');

  // Create IMS records
  const ims1 = await prisma.iMS.create({
    data: {
      ccdId: 'CCD-1',
      reportName: 'Russian Disinformation Campaign Q1 2025',
      description:
        'Comprehensive analysis of Russian disinformation operations targeting EU elections in Q1 2025. Multiple coordinated campaigns identified across social media platforms.',
      date: new Date('2025-01-15'),
      linkOpenCTI: 'https://opencti.example.com/report/001',
      linkDocIntel: 'https://docintel.example.com/doc/001',
      comments: 'High priority - immediate action required',
      status: IMSStatus.IN_PROGRESS,
      priority: PriorityLevel.URGENT,
      analystId: analyst1.id,
      createdById: admin.id,
      tags: {
        create: [
          { tag: { connect: { id: tags[0].id } } },
          { tag: { connect: { id: tags[1].id } } },
          { tag: { connect: { id: tags[3].id } } },
        ],
      },
    },
  });

  const ims2 = await prisma.iMS.create({
    data: {
      ccdId: 'CCD-2',
      reportName: 'Chinese Cyber Espionage Activities',
      description:
        'Analysis of advanced persistent threat (APT) groups linked to Chinese state actors targeting critical infrastructure.',
      date: new Date('2025-01-20'),
      linkOpenCTI: 'https://opencti.example.com/report/002',
      linkDocIntel: 'https://docintel.example.com/doc/002',
      status: IMSStatus.COMPLETED,
      priority: PriorityLevel.HIGH,
      analystId: analyst2.id,
      createdById: admin.id,
      tags: {
        create: [{ tag: { connect: { id: tags[2].id } } }],
      },
    },
  });

  const ims3 = await prisma.iMS.create({
    data: {
      ccdId: 'CCD-3',
      reportName: 'Social Media Manipulation Tactics',
      description:
        'Investigation into coordinated inauthentic behavior on major social media platforms.',
      date: new Date('2025-01-25'),
      linkOpenCTI: 'https://opencti.example.com/report/003',
      status: IMSStatus.DRAFT,
      priority: PriorityLevel.MEDIUM,
      analystId: analyst1.id,
      createdById: analyst1.id,
      tags: {
        create: [
          { tag: { connect: { id: tags[1].id } } },
          { tag: { connect: { id: tags[4].id } } },
        ],
      },
    },
  });

  const ims4 = await prisma.iMS.create({
    data: {
      ccdId: 'CCD-4',
      reportName: 'Election Interference Patterns 2024',
      description:
        'Historical analysis of election interference patterns observed during 2024 elections across multiple countries.',
      date: new Date('2025-01-10'),
      status: IMSStatus.IN_PROGRESS,
      priority: PriorityLevel.HIGH,
      analystId: analyst2.id,
      createdById: analyst2.id,
      tags: {
        create: [
          { tag: { connect: { id: tags[3].id } } },
          { tag: { connect: { id: tags[5].id } } },
        ],
      },
    },
  });

  const ims5 = await prisma.iMS.create({
    data: {
      ccdId: 'CCD-5',
      reportName: 'Unassigned Investigation Report',
      description: 'Pending assignment - requires analyst review.',
      date: new Date('2025-01-28'),
      status: IMSStatus.DRAFT,
      priority: PriorityLevel.LOW,
      createdById: admin.id,
    },
  });

  console.log('✓ Created IMS records');

  // Create comments
  await Promise.all([
    prisma.comment.create({
      data: {
        content: 'Initial analysis complete. Moving to next phase.',
        imsId: ims1.id,
        userId: analyst1.id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'Found additional indicators. Updating report.',
        imsId: ims1.id,
        userId: analyst1.id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'Analysis complete. Ready for review.',
        imsId: ims2.id,
        userId: analyst2.id,
      },
    }),
  ]);

  console.log('✓ Created comments');

  // Create assignment history
  await Promise.all([
    prisma.iMSAssignmentHistory.create({
      data: {
        imsId: ims1.id,
        analystId: analyst1.id,
      },
    }),
    prisma.iMSAssignmentHistory.create({
      data: {
        imsId: ims2.id,
        analystId: analyst2.id,
      },
    }),
  ]);

  console.log('✓ Created assignment history');

  // Create IMS history
  await Promise.all([
    prisma.iMSHistory.create({
      data: {
        imsId: ims1.id,
        action: 'created',
        changes: JSON.stringify({ status: 'DRAFT' }),
      },
    }),
    prisma.iMSHistory.create({
      data: {
        imsId: ims1.id,
        action: 'status_changed',
        changes: JSON.stringify({ from: 'DRAFT', to: 'IN_PROGRESS' }),
      },
    }),
  ]);

  console.log('✓ Created IMS history');

  console.log('\n🎉 Seed completed successfully!\n');
  console.log('📝 Test credentials:');
  console.log('   Admin:    admin@ims.com / password123');
  console.log('   Analyst1: analyst1@ims.com / password123');
  console.log('   Analyst2: analyst2@ims.com / password123');
  console.log('   Viewer:   viewer@ims.com / password123\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
