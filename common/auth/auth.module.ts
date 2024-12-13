import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: 'secretKey',
      signOptions: { expiresIn: '8h' },
    }),
  ],
  exports: [ JwtModule],
})
export class CustomJwtModule {}