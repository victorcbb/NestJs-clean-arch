import {
  SearchParams,
  SearchResult,
  UserRepositoory,
} from '@/users/domain/repositories/user.repository'
import { UseCase } from '@/shared/application/usecases/use-case'
import { SearchInput } from '@/shared/application/dtos/search-input'
import { UserOutput, UserOutputMapper } from '../dto/user-output'
import {
  PaginationOutput,
  PaginationOutputMapper,
} from '@/shared/application/dtos/pagination-output'

export type ListUsersInput = SearchInput<{
  name?: string
  email?: string
}>

export type ListUsersOutput = PaginationOutput<UserOutput>

export class ListUsersUseCase
  implements UseCase<ListUsersInput, ListUsersOutput>
{
  constructor(private userRepository: UserRepositoory) {}

  async execute(input: ListUsersInput): Promise<ListUsersOutput> {
    const params = new SearchParams(input)

    const searchResult = await this.userRepository.search(params)

    return this.toOutput(searchResult)
  }

  private toOutput(searchResult: SearchResult): ListUsersOutput {
    const items = searchResult.items.map(item => {
      return UserOutputMapper.toOutput(item)
    })

    return PaginationOutputMapper.toOutput(items, searchResult)
  }
}
