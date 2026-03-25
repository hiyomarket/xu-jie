import { Controller, Post, Body, Res, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from './jwt.service';

@Controller('auth')
export class AuthController {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  @Post('register')
  async register(
    @Body() body: { email: string; username: string; password: string },
    @Res() res: Response,
  ) {
    const { email, username, password } = body;

    // 檢查用戶是否存在
    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existing) {
      return res.status(400).json({ error: '用戶已存在' });
    }

    // 密碼加密
    const hashedPassword = await bcrypt.hash(password, 10);

    // 建立用戶
    const user = await this.prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });

    // 生成 Token
    const accessToken = this.jwt.generateAccessToken(user.id, user.role);
    const refreshToken = this.jwt.generateRefreshToken(user.id);

    // 設定 Cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ accessToken, user: { id: user.id, username: user.username, role: user.role } });
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Res() res: Response,
  ) {
    const { email, password } = body;

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: '帳號或密碼錯誤' });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ error: '帳號或密碼錯誤' });
    }

    const accessToken = this.jwt.generateAccessToken(user.id, user.role);
    const refreshToken = this.jwt.generateRefreshToken(user.id);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ accessToken, user: { id: user.id, username: user.username, role: user.role } });
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    res.clearCookie('refreshToken');
    return res.json({ success: true });
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: 'No refresh token' });
    }

    const decoded = this.jwt.verifyToken(refreshToken);

    if (!decoded) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const user = await this.prisma.user.findUnique({ where: { id: decoded.userId } });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const accessToken = this.jwt.generateAccessToken(user.id, user.role);

    return res.json({ accessToken });
  }
}
