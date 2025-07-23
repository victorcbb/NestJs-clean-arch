import { SortDirection } from '@/shared/domain/repositories/searchable-repository-contract'
import { ListUsersInput } from '@/users/application/usecases/listusers.usecase'

export class ListUsersDto implements ListUsersInput {
  page?: number
  perPage?: number
  sort?: string
  sortDir?: SortDirection
  filter?: {
    name?: string
    email?: string
  }
}
