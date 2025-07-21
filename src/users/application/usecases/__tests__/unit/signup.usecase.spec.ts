import { UserRepositoory } from '@/users/domain/repositories/user.repository'
import { SignUpUseCase } from '../../signup.usecase'
import { HashProvider } from '@/shared/application/providers/hash-provider'
import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository'
import { BcryptJsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { ConflictError } from '@/users/application/errors/conflict-error'
import { BadRequestError } from '@/shared/application/errors/bad-request-error'

describe('SignUpUseCase unit test', () => {
  let sut: SignUpUseCase
  let userRepository: UserRepositoory
  let hashProvider: HashProvider

  beforeEach(() => {
    userRepository = new UserInMemoryRepository()
    hashProvider = new BcryptJsHashProvider()
    sut = new SignUpUseCase(userRepository, hashProvider)
  })

  it('should create an user', async () => {
    const spyInsert = jest.spyOn(userRepository, 'insert')
    const input = UserDataBuilder({})

    const output = await sut.execute({
      email: input.email,
      name: input.name,
      password: input.password,
    })

    expect(output.id).toBeDefined()
    expect(output.createdAt).toBeInstanceOf(Date)
    expect(spyInsert).toHaveBeenCalledTimes(1)
  })

  it('should not create an user with invalid name', async () => {
    const props = Object.assign(UserDataBuilder({}), { name: null })

    await expect(async () => {
      await sut.execute(props)
    }).rejects.toBeInstanceOf(BadRequestError)
  })

  it('should not create an user with invalid email', async () => {
    const props = Object.assign(UserDataBuilder({}), { email: null })

    await expect(async () => {
      await sut.execute(props)
    }).rejects.toBeInstanceOf(BadRequestError)
  })

  it('should not create an user with invalid password', async () => {
    const props = Object.assign(UserDataBuilder({}), { password: null })

    await expect(async () => {
      await sut.execute(props)
    }).rejects.toBeInstanceOf(BadRequestError)
  })

  it('should not create an user when email is already in use', async () => {
    const input = UserDataBuilder({ email: 'a@a.com' })
    await sut.execute(input)

    await expect(async () => {
      await sut.execute(input)
    }).rejects.toBeInstanceOf(ConflictError)
  })
})
