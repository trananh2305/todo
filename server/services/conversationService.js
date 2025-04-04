import redis from "../config/redisClient.js";

export async function saveConversation(userId, role, content) {
  const message = JSON.stringify({ role, content });
  await redis.lpush(`conversation:${userId}`, message);
  await redis.ltrim(`conversation:${userId}`, 0, 9);
}

export async function getConversationHistory(userId) {
  const messages = await redis.lrange(`conversation:${userId}`, 0, -1);
  return messages.reverse().map((msg) => JSON.parse(msg));
}

export async function getSimilarCachedResponse(userQuestion) {
  const keys = await redis.keys("*");
  const Fuse = (await import("fuse.js")).default;
  const fuse = new Fuse(keys, { threshold: 0.5 });

  const result = fuse.search(userQuestion);
  if (result.length > 0) {
    return await redis.get(result[0].item);
  }
  return null;
}
