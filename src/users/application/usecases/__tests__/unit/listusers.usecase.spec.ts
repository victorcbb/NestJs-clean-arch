import {
  SearchResult,
  UserRepositoory,
} from '@/users/domain/repositories/user.repository'
import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository'
import { ListUsersUseCase } from '../../listusers.usecase'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'

describe('ListUsersUseCase Unit Tests', () => {
  let sut: ListUsersUseCase
  let userRepository: UserRepositoory

  beforeEach(() => {
    userRepository = new UserInMemoryRepository()
    sut = new ListUsersUseCase(userRepository)
  })

  it('toOutput method', () => {
    let result = new SearchResult({
      items: [] as any,
      total: 1,
      currentPage: 1,
      perPage: 2,
      sort: null,
      sortDirection: null,
      filter: null,
    })

    let output = sut['toOutput'](result)

    expect(output).toStrictEqual({
      items: [],
      total: 1,
      currentPage: 1,
      lastPage: 1,
      perPage: 2,
    })

    const user = new UserEntity(UserDataBuilder({}))

    result = new SearchResult({
      items: [user],
      total: 1,
      currentPage: 1,
      perPage: 2,
      sort: null,
      sortDirection: null,
      filter: null,
    })

    output = sut['toOutput'](result)

    expect(output).toStrictEqual({
      items: [user.toJSON()],
      total: 1,
      currentPage: 1,
      lastPage: 1,
      perPage: 2,
    })
  })

  it('should return the users ordened by createAt', async () => {
    const createAt = new Date()
    const items = [
      new UserEntity(UserDataBuilder({ createdAt: createAt })),
      new UserEntity(
        UserDataBuilder({ createdAt: new Date(createAt.getTime() + 1) }),
      ),
    ]

    userRepository['items'] = items

    const output = await sut.execute({})

    expect(output).toStrictEqual({
      items: [...items].reverse().map(item => item.toJSON()),
      total: 2,
      currentPage: 1,
      lastPage: 1,
      perPage: 15,
    })
  })

  it('should return the users using pagination, sort and filter', async () => {
    const items = [
      new UserEntity(UserDataBuilder({ name: 'a' })),
      new UserEntity(UserDataBuilder({ name: 'AA' })),
      new UserEntity(UserDataBuilder({ name: 'Aa' })),
      new UserEntity(UserDataBuilder({ name: 'D' })),
      new UserEntity(UserDataBuilder({ name: 'e' })),
    ]

    userRepository['items'] = items

    let output = await sut.execute({
      page: 1,
      perPage: 2,
      sort: 'name',
      sortDir: 'asc',
      filter: { name: 'a' },
    })

    expect(output).toStrictEqual({
      items: [items[1].toJSON(), items[2].toJSON()],
      total: 3,
      currentPage: 1,
      lastPage: 2,
      perPage: 2,
    })

    output = await sut.execute({
      page: 2,
      perPage: 2,
      sort: 'name',
      sortDir: 'asc',
      filter: { name: 'a' },
    })

    expect(output).toStrictEqual({
      items: [items[0].toJSON()],
      total: 3,
      currentPage: 2,
      lastPage: 2,
      perPage: 2,
    })

    output = await sut.execute({
      page: 1,
      perPage: 3,
      sort: 'name',
      sortDir: 'desc',
      filter: { name: 'a' },
    })

    expect(output).toStrictEqual({
      items: [items[1].toJSON(), items[2].toJSON(), items[0].toJSON()],
      total: 3,
      currentPage: 1,
      lastPage: 1,
      perPage: 3,
    })
  })
})
