import { RedisClientType } from "redis";

import { keyBlacklist, keyJwtExpire } from "./repositories/blacklist.service";

export async function expirer(redis: RedisClientType<any, any, any>) {
  while (1) {
    await expire(redis);

    await new Promise((r) => setTimeout(r, 60 * 1000));
  }
}

async function expire(redis: RedisClientType<any, any, any>) {
  const blacklisteds = await redis.sMembers(keyBlacklist);
  const now = Date.now();

  blacklisteds.forEach(async (token) => {
    const expStr = await redis.hGet(keyJwtExpire, token);
    if (!expStr) {
      return;
    }

    const exp = Number(expStr) * 1000;
    if (isNaN(exp)) {
      console.error(`found non-number exp: ${expStr}`);
      return;
    }

    console.log({ now, token, exp });

    if (now >= exp) {
      console.log(`expiring ${token} at ${exp}`);
      await redis.sRem(keyBlacklist, token);
      await redis.hDel(keyJwtExpire, token);
    }
  });
}
