import { PrismaClient } from "@prisma/client";
import { hashPassword } from "./src/lib/runner-auth";

const prisma = new PrismaClient();

async function main() {
  await prisma.registration.deleteMany();
  await prisma.runner.deleteMany();
  await prisma.group.deleteMany();
  await prisma.event.deleteMany();

  const event1 = await prisma.event.create({
    data: {
      title: "2026 URA 济南半程马拉松",
      slug: "jinan-half-marathon-2026",
      description:
        "山东省大学生长跑 IP 赛事首站，穿越大明湖与泉城广场的城市赛道，感受济南的秋日泉水与街巷风情。",
      city: "济南",
      location: "大明湖风景区 - 泉城广场",
      registrationStart: new Date("2026-08-01T09:00:00+08:00"),
      registrationEnd: new Date("2026-09-15T23:59:59+08:00"),
      eventDate: new Date("2026-10-18T07:00:00+08:00"),
      status: "open",
      groups: {
        create: [
          { name: "半程马拉松男子组", distance: 21.0975, startTime: "07:30", cutoffTime: "11:00", gender: "male", minAge: 18, maxAge: 30, capacity: 1200, fee: 8000 },
          { name: "半程马拉松女子组", distance: 21.0975, startTime: "07:30", cutoffTime: "11:00", gender: "female", minAge: 18, maxAge: 30, capacity: 800, fee: 8000 },
          { name: "迷你跑男子组", distance: 5, startTime: "08:00", cutoffTime: "09:00", gender: "male", minAge: 16, maxAge: 35, capacity: 800, fee: 4000 },
          { name: "迷你跑女子组", distance: 5, startTime: "08:00", cutoffTime: "09:00", gender: "female", minAge: 16, maxAge: 35, capacity: 700, fee: 4000 },
        ],
      },
    },
  });

  await prisma.event.create({
    data: {
      title: "2026 URA 青岛校园跑",
      slug: "qingdao-campus-run-2026",
      description:
        "中国海洋大学校内赛道，环校奔跑感受海滨校园风光，为大学生打造轻量级参赛体验。",
      city: "青岛",
      location: "中国海洋大学（崂山校区）",
      registrationStart: new Date("2026-09-01T09:00:00+08:00"),
      registrationEnd: new Date("2026-10-15T23:59:59+08:00"),
      eventDate: new Date("2026-11-08T08:00:00+08:00"),
      status: "draft",
      groups: {
        create: [
          { name: "校园跑男子组", distance: 3, startTime: "09:00", cutoffTime: "09:45", gender: "male", minAge: 18, maxAge: 28, capacity: 600, fee: 3000 },
          { name: "校园跑女子组", distance: 3, startTime: "09:00", cutoffTime: "09:45", gender: "female", minAge: 18, maxAge: 28, capacity: 400, fee: 3000 },
        ],
      },
    },
  });

  const runner1 = await prisma.runner.create({
    data: {
      name: "张明",
      gender: "male",
      idCard: "370102199801011234",
      phone: "13800138001",
      school: "山东大学",
      password: hashPassword("123456"),
    },
  });

  const runner2 = await prisma.runner.create({
    data: {
      name: "李婷",
      gender: "female",
      idCard: "370202200001022345",
      phone: "13800138002",
      school: "山东师范大学",
      password: hashPassword("123456"),
    },
  });

  const maleGroup = await prisma.group.findFirst({
    where: { eventId: event1.id, name: "半程马拉松男子组" },
  });
  const femaleGroup = await prisma.group.findFirst({
    where: { eventId: event1.id, name: "半程马拉松女子组" },
  });

  await prisma.registration.create({
    data: {
      eventId: event1.id,
      groupId: maleGroup!.id,
      runnerId: runner1.id,
      name: "张明",
      gender: "male",
      idCard: "370102199801011234",
      phone: "13800138001",
      email: "zhangming@example.com",
      school: "山东大学",
      major: "计算机科学与技术",
      emergencyContact: "张伟",
      emergencyPhone: "13900139001",
      status: "paid",
    },
  });

  await prisma.registration.create({
    data: {
      eventId: event1.id,
      groupId: femaleGroup!.id,
      runnerId: runner2.id,
      name: "李婷",
      gender: "female",
      idCard: "370202200001022345",
      phone: "13800138002",
      email: "liting@example.com",
      school: "山东师范大学",
      major: "英语",
      emergencyContact: "李强",
      emergencyPhone: "13900139002",
      status: "pending_payment",
    },
  });

  console.log("Seed 完成: 2 个赛事, 6 个组别, 2 个选手, 2 条报名记录");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());