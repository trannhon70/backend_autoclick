import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { expiresIn } from 'utils';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: expiresIn },
    }),
  ],
  exports: [ JwtModule],
})
export class CustomJwtModule {}