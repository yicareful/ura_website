import { prisma } from "./prisma";

/**
 * 生成一个唯一的、用户不可更改的五位 URA ID（10000..99999）。
 * 用于在显示成绩时区分同名选手。
 */
export async function generateUniqueUraId(): Promise<number> {
  for (let attempt = 0; attempt < 500; attempt++) {
    const candidate = Math.floor(Math.random() * 90000) + 10000; // 10000..99999
    const existing = await prisma.runner.findUnique({
      where: { uraId: candidate },
      select: { id: true },
    });
    if (!existing) return candidate;
  }
  throw new Error("无法生成唯一的 URA ID，请稍后重试");
}
