import { PrismaClient, User } from '@prisma/client'
import { UserModelMapper } from '../../user-model.mapper'
import { ValidationError } from '@/shared/domain/errors/validation-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { setUpPrismaTests } from '@/shared/infrastructure/database/prisma/testing/setup-prisma-tests'

describe('UserModelMapper integration tests', () => {
  let prismaClient: PrismaClient
  let props: any

  beforeAll(async () => {
    setUpPrismaTests()

    prismaClient = new PrismaClient()

    await prismaClient.$connect()
  })

  beforeEach(async () => {
    await prismaClient.user.deleteMany()

    props = {
      id: 'a81bc81b-dead-4e5d-abff-90865d1e13b1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
      createdAt: new Date(),
    }
  })

  afterAll(async () => {
    await prismaClient.$disconnect()
  })

  it('should throws error when user model is invalid', () => {
    const userModel: User = Object.assign(props, { name: null })
    expect(() => UserModelMapper.toEntity(userModel)).toThrow(ValidationError)
  })

  it('should convert a user model into a user entity', async () => {
    const userModel: User = await prismaClient.user.create({
      data: props,
    })
    const sut = UserModelMapper.toEntity(userModel)

    expect(sut).toBeInstanceOf(UserEntity)
    expect(sut.toJSON()).toStrictEqual(props)
  })
})
