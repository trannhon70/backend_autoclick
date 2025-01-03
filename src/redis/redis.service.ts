import { Injectable } from '@nestjs/common';
import Redis from 'ioredis'; // Chú ý cách import này!

@Injectable()
export class RedisService {
  private readonly redis: Redis;

  constructor() {
    // Khởi tạo kết nối Redis
    this.redis = new Redis({
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT, 10) || 6379,
      password: '', // Nếu có mật khẩu
      db: 0,              // Cơ sở dữ liệu Redis
    });
    this.redis.on('connect', () => {
        console.log('Đã kết nối đến Redis!');
      });
      
      this.redis.on('error', (error) => {
        console.error('Lỗi Redis:', error);
      }); 
  }

  // Ví dụ các phương thức sử dụng Redis
  async setKey(key: string, value: string, p0: number) {
    await this.redis.set(key, value);
  } 

  async getKey(key: string) {
    return await this.redis.get(key);
  }

  async delKey(key: string) {
    await this.redis.del(key); // Xóa khóa Redis
  }

  // Đảm bảo tắt kết nối Redis khi không sử dụng
  async onModuleDestroy() {
    await this.redis.quit();
  }
}
