import { InMemorySearchableRepository } from '@/shared/domain/repositories/in-memory-searchable.repository'
import { SortDirection } from '@/shared/domain/repositories/searchable-repository-contract'
import { UserEntity } from '@/users/domain/entities/user.entity'
import {
  UserFilter,
  UserRepositoory,
} from '@/users/domain/repositories/user.repository'

export class UserInMemoryRepository
  extends InMemorySearchableRepository<UserEntity>
  implements UserRepositoory
{
  sortableFields = ['name', 'createdAt']

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.items.find(user => user.email === email) || null
  }
  async emailExists(email: string): Promise<boolean> {
    return this.items.some(user => user.email === email)
  }
  protected async applyFilter(
    items: UserEntity[],
    filter: UserFilter,
  ): Promise<UserEntity[]> {
    if (!filter) {
      return items
    }

    if (filter.name && filter.email) {
      return items.filter(
        item =>
          item.name.toLowerCase().includes(filter.name.toLowerCase()) &&
          item.email.toLowerCase().includes(filter.email.toLowerCase()),
      )
    }

    if (filter.name) {
      return items.filter(item =>
        item.name.toLowerCase().includes(filter.name.toLowerCase()),
      )
    }

    if (filter.email) {
      return items.filter(item =>
        item.email.toLowerCase().includes(filter.email.toLowerCase()),
      )
    }

    return items
  }

  protected async applySort(
    items: UserEntity[],
    sort: string | null,
    sortDirection: SortDirection | null,
  ): Promise<UserEntity[]> {
    return !sort
      ? super.applySort(items, 'createdAt', 'desc')
      : super.applySort(items, sort, sortDirection)
  }
}
