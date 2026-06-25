import { PrismaClient, student_sex } from "@/prisma/generated/prisma-client";

const prisma = new PrismaClient();

async function main() {
  const now = new Date();

  // 1. ANNOUNCEMENTS
  await prisma.announcement.createMany({
    data: [
      {
        title: "New Term Begins",
        description: "Welcome back! The new academic term starts next week.",
        date: now,
      },
      {
        title: "Holiday Notice",
        description: "School will be closed next Monday for a public holiday.",
        date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      },
    ],
    skipDuplicates: true,
  });

  // 2. QUOTATIONS
  // await prisma.quotation.createMany({
  //   data: [
  //     {
  //       name: "John Doe",
  //       email: "john@example.com",
  //       tel: "123456789012",
  //       subject: "Request for Service Quotation",
  //       message: "Please send a quotation for website design services.",
  //       createdAt: now,
  //     },
  //     {
  //       name: "Jane Smith",
  //       email: "jane@example.com",
  //       tel: "987654321000",
  //       subject: "Pricing Inquiry",
  //       message: "Interested in getting a quotation for consultation.",
  //       createdAt: now,
  //     },
  //   ],
  //   skipDuplicates: true,
  // });

  // 3. STUDENTS
  for (let i = 1; i <= 5; i++) {
    await prisma.student.create({
      data: {
        id: `stu${i}`,
        username: `student${i}`,
        name: `StudentName${i}`,
        surname: `StudentSurname${i}`,
        email: `student${i}@school.com`,
        phone: `0123456789${i}`,
        address: `123 Street ${i}`,
        img: null,
        bloodType: "O+",
        sex: i % 2 === 0 ? student_sex.MALE : student_sex.FEMALE,
        createdAt: now,
        birthday: new Date(now.getFullYear() - 15, 0, i), // 15 years old
      },
    });
  }

  // 4. USERS
  // for (let i = 1; i <= 3; i++) {
  //   await prisma.user.create({
  //     data: {
  //       user_id: `user${i}`,
  //       email: `user${i}@domain.com`,
  //       firstName: `First${i}`,
  //       lastName: `Last${i}`,
  //       phone: `0987654321${i}`,
  //       createdAt: now,
  //       updatedAt: now,
  //       signature: null,
  //     },
  //   });
  // }

}

main()
  .catch((e) => {
    console.error("❌ - Error during seeding:", e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
