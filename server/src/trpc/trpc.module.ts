import { Module } from '@nestjs/common';
import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { PrismaService } from '../prisma/prisma.service';

export const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;

@Module({
  providers: [t.router, PrismaService],
  exports: [t.router],
})
export class TrpcModule {}
