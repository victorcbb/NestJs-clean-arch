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
})
