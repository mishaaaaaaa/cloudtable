import { createClient } from "redis";

export const pubClient = createClient({ url: process.env.REDIS_URL });
export const subClient = pubClient.duplicate();

export async function connectRedis() {
  await Promise.all([pubClient.connect(), subClient.connect()]);
  console.log("✅ Redis connected");
}
