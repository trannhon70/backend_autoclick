// src/redis/redis.module.ts
import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';

@Module({
  providers: [RedisService],
  exports: [RedisService], // Để có thể sử dụng RedisService ở các module khác
})
export class RedisModule {}