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
      items: [
        {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
      ],
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
      items: [...items].reverse().map(item => {
        return {
          id: item.id,
          name: item.name,
          email: item.email,
          createdAt: item.createdAt,
        }
      }),
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
      items: [
        {
          id: items[1].id,
          name: items[1].name,
          email: items[1].email,
          createdAt: items[1].createdAt,
        },
        {
          id: items[2].id,
          name: items[2].name,
          email: items[2].email,
          createdAt: items[2].createdAt,
        },
      ],
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
      items: [
        {
          id: items[0].id,
          name: items[0].name,
          email: items[0].email,
          createdAt: items[0].createdAt,
        },
      ],
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
      items: [
        {
          id: items[1].id,
          name: items[1].name,
          email: items[1].email,
          createdAt: items[1].createdAt,
        },
        {
          id: items[2].id,
          name: items[2].name,
          email: items[2].email,
          createdAt: items[2].createdAt,
        },
        {
          id: items[0].id,
          name: items[0].name,
          email: items[0].email,
          createdAt: items[0].createdAt,
        },
      ],
      total: 3,
      currentPage: 1,
      lastPage: 1,
      perPage: 3,
    })
  })
})
