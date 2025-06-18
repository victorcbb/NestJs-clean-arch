import { Module } from '@nestjs/common';
import { EnvConfigService } from './env-config.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [EnvConfigService, ConfigService],
})
export class EnvConfigModule {}
