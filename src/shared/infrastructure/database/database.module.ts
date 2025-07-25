import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { EnvConfigModule } from '../env-config/env-config.module'
import { ConfigService } from '@nestjs/config'

@Module({
  imports: [EnvConfigModule.forRoot()],
  providers: [PrismaService, ConfigService],
  exports: [PrismaService],
})
export class DatabaseModule {}
