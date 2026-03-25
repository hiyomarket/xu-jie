import { Module } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { AuthController } from './auth.controller';

@Module({
  providers: [JwtService],
  controllers: [AuthController],
  exports: [JwtService],
})
export class AuthModule {}
