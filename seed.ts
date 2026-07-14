import { PrismaClient } from "@prisma/client";

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
      description: "山东省大学生长跑IP赛事首站，穿越大明湖与泉城广场的城市半马赛道，感受济南的秋日泉水与街巷风情。",
      city: "济南",
      location: "大明湖风景区 - 泉城广场",
      registrationStart: new Date(1785546000000),
      registrationEnd: new Date(1789487999000),
      eventDate: new Date(1792278000000),
      status: "finished",
      groups: { create: [
        { name: "半程马拉松 - 男子组", distance: 21.0975, startTime: "07:30", cutoffTime: "10:30", gender: "male", minAge: 18, maxAge: 30, capacity: 1200, fee: 8000, isOpen: true },
        { name: "半程马拉松 - 女子组", distance: 21.0975, startTime: "07:30", cutoffTime: "10:30", gender: "female", minAge: 18, maxAge: 30, capacity: 800, fee: 8000, isOpen: true },
        { name: "迷你跑 - 男子组", distance: 5, startTime: "08:00", cutoffTime: "10:00", gender: "male", minAge: 16, maxAge: 35, capacity: 800, fee: 4000, isOpen: true },
        { name: "迷你跑 - 女子组", distance: 5, startTime: "08:00", cutoffTime: "10:00", gender: "female", minAge: 16, maxAge: 35, capacity: 700, fee: 4000, isOpen: true },
      ] },
    },
  });

  const event2 = await prisma.event.create({
    data: {
      title: "2026 URA 青岛校园跑",
      slug: "qingdao-campus-run-2026",
      description: "中国海洋大学校内赛道，环校奔跑感受海滨校园风光，为大学生打造轻量级参赛体验。",
      city: "青岛",
      location: "中国海洋大学（崂山校区）",
      registrationStart: new Date(1788224400000),
      registrationEnd: new Date(1792079999000),
      eventDate: new Date(1794096000000),
      status: "draft",
      groups: { create: [
        { name: "校园跑 - 男子组", distance: 3, startTime: "09:00", cutoffTime: "11:00", gender: "male", minAge: 18, maxAge: 28, capacity: 600, fee: 3000, isOpen: true },
        { name: "校园跑 - 女子组", distance: 3, startTime: "09:00", cutoffTime: "11:00", gender: "female", minAge: 18, maxAge: 28, capacity: 400, fee: 3000, isOpen: true },
      ] },
    },
  });

  const event3 = await prisma.event.create({
    data: {
      title: "2026临沭马拉松",
      slug: "2026临沭马拉松",
      description: "test",
      city: "临沂市",
      location: "临沭人民广场",
      registrationStart: new Date(1783434000000),
      registrationEnd: new Date(1784902800000),
      eventDate: new Date(1792765200000),
      status: "open",
      groups: { create: [
        { name: "马拉松 - 大众组", distance: 42.195, startTime: "08:00", cutoffTime: "14:00", gender: "all", minAge: 16, maxAge: null, capacity: 100, fee: 8000, isOpen: true },
        { name: "马拉松 - 精英组", distance: 42.195, startTime: "08:00", cutoffTime: "14:00", gender: "all", minAge: 16, maxAge: null, capacity: 400, fee: 8000, isOpen: true },
      ] },
    },
  });

  const runner1 = await prisma.runner.create({
    data: {
      name: "张明",
      gender: "male",
      idCard: "370102199801011234",
      phone: "13800138001",
      school: "山东大学",
      uraId: 13801,
      password: "1088d7fe303fa68e041b49f0902fdca6:ed8b163e9734e6402d38350dd58aa363c5a4c4e9125df2797a1fbf7846a65d7fc8ab76454de04f9292dd5d1bfbd7edd8938ac5e366e0b93eff826bb8531dcd7b",
    },
  });

  const runner2 = await prisma.runner.create({
    data: {
      name: "李婷",
      gender: "female",
      idCard: "370202200001022345",
      phone: "13800138002",
      school: "山东师范大学",
      uraId: 24917,
      password: "ad2dcada5995d28ddcc42952f86f824e:6c61c39e556e37796cbd6f5d1e9b42a055770116186ef642b84671bf284cdb2ec8454f2743cf20d9dd524dfde0d187b9a74bac77a80a667586f6530f85a1e868",
    },
  });

  const runner3 = await prisma.runner.create({
    data: {
      name: "易凯丰",
      gender: "male",
      idCard: "123456789012344111",
      phone: "18008800951",
      school: "哈尔滨工业大学",
      uraId: 99833,
      email: "2968617911@qq.com",
      major: "软件工程",
      password: "e0fc4585c7de1afddcceb1d7244cafe0:85b887765784ec07346a7bd06ca78d2ecde42b68161a583f09e1259b6521cee4c0c64e99487d827ea220d6282c7d310efac2ce7e00a9e2d15a5b87dddcea71c3",
    },
  });

  async function findGroup(eventSlug, groupName) {
    const g = await prisma.group.findFirst({ where: { event: { slug: eventSlug }, name: groupName } });
    if (!g) throw new Error(`Group not found: ${eventSlug} / ${groupName}`);
    return g;
  }
  async function findRunnerByPhone(phone) {
    return prisma.runner.findUnique({ where: { phone } });
  }

  // Registration 1: 张明 -> 2026 URA 济南半程马拉松 / 半程马拉松 - 男子组
  const regRunner1 = await findRunnerByPhone("13800138001");
  await prisma.registration.create({
    data: {
      event: { connect: { slug: "jinan-half-marathon-2026" } },
      group: { connect: { id: (await findGroup("jinan-half-marathon-2026", "半程马拉松 - 男子组")).id } },
      runner: { connect: { id: regRunner1!.id } },
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

  // Registration 2: 李婷 -> 2026 URA 济南半程马拉松 / 半程马拉松 - 女子组
  const regRunner2 = await findRunnerByPhone("13800138002");
  await prisma.registration.create({
    data: {
      event: { connect: { slug: "jinan-half-marathon-2026" } },
      group: { connect: { id: (await findGroup("jinan-half-marathon-2026", "半程马拉松 - 女子组")).id } },
      runner: { connect: { id: regRunner2!.id } },
      name: "李婷",
      gender: "female",
      idCard: "370202200001022345",
      phone: "13800138002",
      email: "liting@example.com",
      school: "山东师范大学",
      major: "英语",
      emergencyContact: "李强",
      emergencyPhone: "13900139002",
      status: "paid",
    },
  });

  console.log("Seed 完成: 3 个赛事, 8 个组别, 3 个选手, 2 条报名记录");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
