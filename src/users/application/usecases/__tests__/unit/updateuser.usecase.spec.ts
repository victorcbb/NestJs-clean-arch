import { UserRepositoory } from '@/users/domain/repositories/user.repository'
import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository'
import { NotFoundError } from '@/shared/application/errors/not-found-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UpdateUserUseCase } from '../../updateuser.usecase'
import { BadRequestError } from '@/shared/application/errors/bad-request-error'

describe('UpdateUserUseCase unit test', () => {
  let sut: UpdateUserUseCase
  let userRepository: UserRepositoory

  beforeEach(() => {
    userRepository = new UserInMemoryRepository()
    sut = new UpdateUserUseCase(userRepository)
  })

  it('should throw error when name not provided', async () => {
    const item = new UserEntity(UserDataBuilder({}))
    await userRepository.insert(item)

    await expect(async () => {
      await sut.execute({ id: item.id, name: '' })
    }).rejects.toBeInstanceOf(BadRequestError)
  })

  it('should throw error when user not found', async () => {
    await expect(async () => {
      await sut.execute({ id: 'fake-id', name: 'New Name' })
    }).rejects.toBeInstanceOf(NotFoundError)
  })

  it('should update a user', async () => {
    const spyUpdate = jest.spyOn(userRepository, 'update')
    const item = new UserEntity(UserDataBuilder({}))
    await userRepository.insert(item)

    const output = await sut.execute({ id: item.id, name: 'New Name' })

    expect(spyUpdate).toHaveBeenCalledTimes(1)
    expect(output).toStrictEqual({
      id: item.id,
      name: 'New Name',
      email: item.email,
      createdAt: item.createdAt,
    })
  })
})
