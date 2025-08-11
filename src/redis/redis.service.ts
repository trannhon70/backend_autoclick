import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Redis from 'ioredis';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
type RedisClient = InstanceType<typeof Redis>;
@Injectable()
export class RedisService implements OnModuleDestroy {
    private readonly redis: RedisClient;
    private readonly subscriber: RedisClient; // Thêm dòng này


    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        // private readonly socketService: SocketService
    ) {

        // Redis chính để get/set
        this.redis = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379', 10),
            db: 0,
        });

        // Redis riêng cho subscriber
        this.subscriber = new Redis({
            host: process.env.REDIS_HOST || 'app_redis',
            port: parseInt(process.env.REDIS_PORT || '6379', 10),
            db: 0,
        });

        this.redis.on('connect', () => {
            console.log('✅ Đã kết nối Redis chính');
        });

        this.redis.on('error', (error) => {
            console.error('❌ Redis error:', error);
        });

        this.subscriber.on('connect', () => {
            console.log('✅ Đã kết nối Redis subscriber');
        });

        this.subscriber.on('error', (error) => {
            console.error('❌ Redis subscriber error:', error);
        });

        this.initKeyspaceListener();
    }

    private initKeyspaceListener() {
        this.subscriber.subscribe('__keyevent@0__:expired', (err, count) => {
            if (err) {
                console.error('❌ Redis subscribe lỗi:', err);
            } else {
                console.log(`📡 Redis subscribe success: ${count} channels`);
            }
        });

        this.subscriber.on('message', async (channel, key) => {
            if (channel !== '__keyevent@0__:expired') return;

            try {
                const userMatch = key.match(/^user:(\d+):session$/);

                if (userMatch) {
                    const userId = parseInt(userMatch[1], 10);
                    console.log(`🔒 Session expired for user ${userId}`);
                    await this.userRepository.update({ id: userId }, { online: false });
                    //   const user = await this.userRepository.findOne({where:{id: userId}})
                    //   await this.socketService.emitToAll('user_online', user);
                }

            } catch (error) {
                console.error(`❌ Error handling Redis key expiration: ${key}`, error);
            }
        });
    }

    async setKey(key: string, value: string, ttlInSeconds: number) {
        await this.redis.set(key, value, 'EX', ttlInSeconds);
    }

    async getKey(key: string) {
        return await this.redis.get(key);
    }

    async getall(key: string) {
        return await this.redis.keys(key);
    }

    async delKey(key: string) {
        await this.redis.del(key);
    }

    async ttlKey(key: string): Promise<number> {
        return await this.redis.ttl(key);
    }

    async onModuleDestroy() {
        await this.redis.quit();
        await this.subscriber.quit(); // đừng quên đóng luôn subscriber
    }

}
