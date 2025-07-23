import { UserRepositoory } from '@/users/domain/repositories/user.repository'
import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UpdatePasswordUseCase } from '../../updatepassword.usecase'
import { BcryptJsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider'
import { HashProvider } from '@/shared/application/providers/hash-provider'
import { InvalidPasswordError } from '@/shared/application/errors/invalid-password-error'
import { NotFoundError } from '@/shared/application/errors/not-found-error'

describe('UpdatePasswordUseCase unit test', () => {
  let sut: UpdatePasswordUseCase
  let userRepository: UserRepositoory
  let hashProvider: HashProvider

  beforeEach(() => {
    userRepository = new UserInMemoryRepository()
    hashProvider = new BcryptJsHashProvider()
    sut = new UpdatePasswordUseCase(userRepository, hashProvider)
  })

  it('should throw error when password or oldPassword not provided', async () => {
    await expect(async () => {
      await sut.execute({ id: 'id', password: '', oldPassword: '123123123' })
    }).rejects.toBeInstanceOf(InvalidPasswordError)
    await expect(async () => {
      await sut.execute({ id: 'id', password: '123123123', oldPassword: '' })
    }).rejects.toBeInstanceOf(InvalidPasswordError)
  })

  it('should throw error when user not found', async () => {
    await expect(async () => {
      await sut.execute({
        id: 'fake-id',
        password: '1234',
        oldPassword: '4321',
      })
    }).rejects.toBeInstanceOf(NotFoundError)
  })

  it('should throw error when oldPassword is invalid', async () => {
    const hashPassword = await hashProvider.generateHash('123123')

    const item = new UserEntity(UserDataBuilder({ password: hashPassword }))
    await userRepository.insert(item)

    await expect(async () => {
      await sut.execute({
        id: item.id,
        password: '321321',
        oldPassword: 'wrong-password',
      })
    }).rejects.toBeInstanceOf(InvalidPasswordError)
  })

  it('should update a user password', async () => {
    const spyUpdate = jest.spyOn(userRepository, 'update')
    const hashPassword = await hashProvider.generateHash('123123')
    const item = new UserEntity(UserDataBuilder({ password: hashPassword }))

    await userRepository.insert(item)

    await sut.execute({
      id: item.id,
      password: '321321',
      oldPassword: '123123',
    })

    const updatedUser = await userRepository.findById(item.id)
    const checkNewPassword = await hashProvider.compareHash(
      '321321',
      updatedUser.password,
    )

    expect(spyUpdate).toHaveBeenCalledTimes(1)
    expect(checkNewPassword).toBeTruthy()
  })
})
