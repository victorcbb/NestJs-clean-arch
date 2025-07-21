import { UserRepositoory } from '@/users/domain/repositories/user.repository'
import { GetUserUseCase } from '../../getuser.usecase'
import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository'
import { NotFoundError } from '@/shared/application/errors/not-found-error'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'

describe('GetUserUseCase unit test', () => {
  let sut: GetUserUseCase
  let userRepository: UserRepositoory

  beforeEach(() => {
    userRepository = new UserInMemoryRepository()
    sut = new GetUserUseCase(userRepository)
  })

  it('should throw error when user not found', async () => {
    await expect(async () => {
      await sut.execute({ id: 'fake-id' })
    }).rejects.toBeInstanceOf(NotFoundError)
  })

  it('should be able to get a user', async () => {
    const spyFindById = jest.spyOn(userRepository, 'findById')
    const item = new UserEntity(UserDataBuilder({}))
    await userRepository.insert(item)

    const output = await sut.execute({ id: item.id })

    expect(spyFindById).toHaveBeenCalledTimes(1)
    expect(output).toStrictEqual({
      id: item.id,
      name: item.name,
      email: item.email,
      createdAt: item.createdAt,
    })
  })
})
