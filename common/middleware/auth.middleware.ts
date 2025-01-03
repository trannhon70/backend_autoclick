import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { RedisService } from 'src/redis/redis.service';


@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) { }

  async use(req: any, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // Kiểm tra xem token có hợp lệ hay không
    if (!token) {
      throw new UnauthorizedException('Token không hợp lệ hoặc không tồn tại');
    }

    try {
      const decoded = this.jwtService.verify(token); // Xác thực token

      const sessionData = await this.redisService.getKey(`user:${decoded.id}:session`);
      if (!sessionData) {
        throw new UnauthorizedException('Phiên đăng nhập đã hết hạn hoặc không hợp lệ.');
      }

      const session = JSON.parse(sessionData);
      if (session.token !== token || Date.now() > session.expiresAt) {
        throw new UnauthorizedException('Phiên đăng nhập đã hết hạn hoặc không hợp lệ.');
      }
      req.user = decoded; // Lưu thông tin người dùng vào request
      next();
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token đã hết hạn. Vui lòng đăng nhập lại.');
      } else {
        // Xử lý các lỗi khác liên quan đến token
        throw new UnauthorizedException('Tài khoản đã được đăng nhập nơi khác!');
      }
    }
  }
}
