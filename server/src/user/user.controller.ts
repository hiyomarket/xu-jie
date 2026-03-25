import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '../auth/jwt.service';

@Controller('user')
export class UserController {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  @Get('me')
  async getMe(@Req() req: Request) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return { error: 'No token' };

    const token = authHeader.replace('Bearer ', '');
    const decoded = this.jwt.verifyToken(token);

    if (!decoded) return { error: 'Invalid token' };

    const user = await this.prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        gold: true,
        level: true,
        exp: true,
        createdAt: true,
      },
    });

    return user;
  }

  @Get('profile')
  async getProfile(@Req() req: Request) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return { error: 'No token' };

    const token = authHeader.replace('Bearer ', '');
    const decoded = this.jwt.verifyToken(token);

    if (!decoded) return { error: 'Invalid token' };

    const user = await this.prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        pets: true,
        inventory: {
          include: { item: true },
        },
      },
    });

    return user;
  }
}
