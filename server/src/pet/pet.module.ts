import { Module } from '@nestjs/common';
import { PetController } from './pet.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [PetController],
  providers: [PrismaService],
})
export class PetModule {}
