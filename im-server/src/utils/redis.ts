import Redis from 'ioredis';
import { config } from 'src/config';

// let n: number = 0;
const redisIndex = []; // 用于记录 redis 实例索引
const redisList = []; // 用于存储 redis 实例

export class RedisIntance {
  static async initRedis(method: string, db = 0) {
    const isExist = redisIndex.some((x) => x == db);
    if (!isExist) {
      redisList[db] = new Redis({ ...config.redis, db });
      redisIndex.push(db);
    }
    return redisList[db];
  }
}
