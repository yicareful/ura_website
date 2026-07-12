import Redis from "ioredis";

let redis: Redis | null = null;

function getRedis(): Redis {
  if (!redis) {
    redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
    redis.on("error", (err) => {
      console.warn("[Redis]", err.message);
    });
  }
  return redis;
}

/** 获取验证码 */
export async function getSmsCode(phone: string): Promise<string | null> {
  return getRedis().get(`sms:${phone}`);
}

/** 存储验证码（默认5分钟过期） */
export async function setSmsCode(phone: string, code: string, ttl = 300) {
  await getRedis().set(`sms:${phone}`, code, "EX", ttl);
}

/** 删除验证码（用完即焚） */
export async function delSmsCode(phone: string) {
  await getRedis().del(`sms:${phone}`);
}

/** 频率限制：同一手机号60秒内只能发一次 */
export async function checkSmsRateLimit(phone: string): Promise<boolean> {
  const key = `sms:rate:${phone}`;
  const client = getRedis();
  const exists = await client.exists(key);
  if (exists) return false;
  await client.set(key, "1", "EX", 60);
  return true;
}

/** 存储注册临时令牌（默认15分钟过期） */
export async function setRegTempToken(token: string, phone: string, ttl = 900) {
  await getRedis().set(`reg:token:${token}`, phone, "EX", ttl);
}

/** 获取注册临时令牌对应的手机号 */
export async function getRegTempToken(token: string): Promise<string | null> {
  return getRedis().get(`reg:token:${token}`);
}

/** 删除注册临时令牌 */
export async function delRegTempToken(token: string) {
  await getRedis().del(`reg:token:${token}`);
}

export default getRedis;
