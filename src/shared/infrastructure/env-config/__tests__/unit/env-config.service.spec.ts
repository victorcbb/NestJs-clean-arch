import { Test, TestingModule } from '@nestjs/testing'
import { EnvConfigService } from '../../env-config.service'
import { ConfigService } from '@nestjs/config'
import { EnvConfigModule } from '../../env-config.module'

describe('EnvConfigService unit test', () => {
  let sut: EnvConfigService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EnvConfigModule.forRoot()],
      providers: [EnvConfigService, ConfigService],
    }).compile()

    sut = module.get<EnvConfigService>(EnvConfigService)
  })

  it('should be defined', () => {
    expect(sut).toBeDefined()
  })

  it('should return the variable PORT', () => {
    expect(sut.getAppPort()).toBe(3000)
  })

  it('should return the variable NODE_ENV', () => {
    expect(sut.getNodeEnv()).toBe('test')
  })
})
