import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtService {
  private secret: string;
  private accessExpire = '15m';
  private refreshExpire = '7d';

  constructor(private config: ConfigService) {
    this.secret = this.config.get('JWT_SECRET') || 'xu-jie-secret-key-2024';
  }

  generateAccessToken(userId: number, role: string): string {
    return jwt.sign({ userId, role }, this.secret, { expiresIn: this.accessExpire });
  }

  generateRefreshToken(userId: number): string {
    return jwt.sign({ userId }, this.secret, { expiresIn: this.refreshExpire });
  }

  verifyToken(token: string): { userId: number; role: string } | null {
    try {
      return jwt.verify(token, this.secret) as { userId: number; role: string };
    } catch {
      return null;
    }
  }
}
