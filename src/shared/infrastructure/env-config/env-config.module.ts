import { DynamicModule, Module } from '@nestjs/common'
import { EnvConfigService } from './env-config.service'
import {
  ConfigModule,
  ConfigModuleOptions,
  ConfigService,
} from '@nestjs/config'
import { join } from 'node:path'

@Module({
  providers: [EnvConfigService, ConfigService],
})
export class EnvConfigModule {
  static forRoot(options: ConfigModuleOptions = {}): DynamicModule {
    return {
      module: EnvConfigModule,
      imports: [
        ConfigModule.forRoot({
          ...options,
          envFilePath: [
            join(
              __dirname,
              `../../../../.env.${process.env.NODE_ENV || 'development'}`,
            ),
          ],
        }),
      ],
    }
  }
}
