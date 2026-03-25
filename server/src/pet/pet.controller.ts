import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '../auth/jwt.service';

@Controller('pet')
export class PetController {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  private getUserId(req: Request): number | null {
    const authHeader = req.headers.authorization;
    if (!authHeader) return null;
    const token = authHeader.replace('Bearer ', '');
    const decoded = this.jwt.verifyToken(token);
    return decoded?.userId || null;
  }

  @Get('my')
  async getMyPets(@Req() req: Request) {
    const userId = this.getUserId(req);
    if (!userId) return { error: 'Unauthorized' };

    return this.prisma.pet.findMany({
      where: { userId },
      include: { user: { select: { username: true } } },
    });
  }

  @Get('types')
  async getPetTypes() {
    return this.prisma.petType.findMany();
  }

  @Post('catch')
  async catchPet(@Body() body: { petTypeId: number; petName: string }, @Req() req: Request) {
    const userId = this.getUserId(req);
    if (!userId) return { error: 'Unauthorized' };

    const petType = await this.prisma.petType.findUnique({ where: { id: body.petTypeId } });
    if (!petType) return { error: 'Pet type not found' };

    // 簡易捕捉邏輯（可擴展）
    const pet = await this.prisma.pet.create({
      data: {
        userId,
        petTypeId: body.petTypeId,
        name: body.petName,
        hp: petType.baseHp,
        mp: petType.baseMp,
        strength: petType.baseStr,
        intelligence: petType.baseInt,
        agility: petType.baseAgi,
        endurance: petType.baseEnd,
        hpMax: petType.baseHp,
        mpMax: petType.baseMp,
        attack: petType.baseStr,
        defense: petType.baseEnd,
        speed: petType.baseAgi,
      },
    });

    return pet;
  }
}
