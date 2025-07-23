import { UserRepositoory } from '@/users/domain/repositories/user.repository'
import { HashProvider } from '@/shared/application/providers/hash-provider'
import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository'
import { BcryptJsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { BadRequestError } from '@/shared/application/errors/bad-request-error'
import { SignInUseCase } from '../../signin.usecase'
import { NotFoundError } from '@/shared/application/errors/not-found-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { InvalidCredentialsError } from '@/users/application/errors/invalid-credentials-error'

describe('SignInUseCase unit test', () => {
  let sut: SignInUseCase
  let userRepository: UserRepositoory
  let hashProvider: HashProvider

  beforeEach(() => {
    userRepository = new UserInMemoryRepository()
    hashProvider = new BcryptJsHashProvider()
    sut = new SignInUseCase(userRepository, hashProvider)
  })

  it('should not authenticate with an user with email or password not provided', async () => {
    await expect(async () => {
      await sut.execute({ email: 'test@email.com', password: '' })
    }).rejects.toBeInstanceOf(BadRequestError)

    await expect(async () => {
      await sut.execute({ email: '', password: '123123' })
    }).rejects.toBeInstanceOf(BadRequestError)
  })

  it('should throw an error if not find a user by email', async () => {
    await expect(async () => {
      await sut.execute({ email: 'fake@email.com', password: '123456' })
    }).rejects.toBeInstanceOf(NotFoundError)
  })

  it('should throw an error if password is invalid', async () => {
    const hashPassword = await hashProvider.generateHash('123123')

    const item = new UserEntity(UserDataBuilder({ password: hashPassword }))
    await userRepository.insert(item)

    await expect(async () => {
      await sut.execute({ email: item.email, password: '123456' })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should authenticate with an user', async () => {
    const spyFindByEmail = jest.spyOn(userRepository, 'findByEmail')
    const hashPassword = await hashProvider.generateHash('123123')
    const item = new UserEntity(UserDataBuilder({ password: hashPassword }))
    await userRepository.insert(item)

    const output = await sut.execute({
      email: item.email,
      password: '123123',
    })

    expect(spyFindByEmail).toHaveBeenCalledTimes(1)
    expect(output).toStrictEqual({
      id: item.id,
      name: item.name,
      email: item.email,
      createdAt: item.createdAt,
    })
  })
})
