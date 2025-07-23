import { UserRepositoory } from '@/users/domain/repositories/user.repository'
import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository'
import { NotFoundError } from '@/shared/application/errors/not-found-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { DeleteUserUseCase } from '../../deleteuser.usecase'

describe('DeleteUserUseCase unit test', () => {
  let sut: DeleteUserUseCase
  let userRepository: UserRepositoory

  beforeEach(() => {
    userRepository = new UserInMemoryRepository()
    sut = new DeleteUserUseCase(userRepository)
  })

  it('should throw error when user not found', async () => {
    await expect(async () => {
      await sut.execute({ id: 'fake-id' })
    }).rejects.toBeInstanceOf(NotFoundError)
  })

  it('should be able to delete a user', async () => {
    const spyDelete = jest.spyOn(userRepository, 'delete')
    const item = new UserEntity(UserDataBuilder({}))
    await userRepository.insert(item)

    expect(userRepository['items']).toHaveLength(1)
    await sut.execute({ id: item.id })

    expect(spyDelete).toHaveBeenCalledTimes(1)
    expect(userRepository['items']).toHaveLength(0)
  })
})
