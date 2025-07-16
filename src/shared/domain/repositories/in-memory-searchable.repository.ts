import { Entity } from '../entities/entity'
import { InMemoryRepository } from './in-memory.repository'
import {
  SearchableRepositoryInterface,
  SearchParams,
  SearchResult,
  SortDirection,
} from './searchable-repository-contract'

export abstract class InMemorySearchableRepository<E extends Entity>
  extends InMemoryRepository<E>
  implements SearchableRepositoryInterface<E, any, any>
{
  sortableFields: string[] = []
  items: E[] = []

  async search(props: SearchParams): Promise<SearchResult<E>> {
    const itemsFiltered = await this.applyFilter(this.items, props.filter)
    const itemsSorted = await this.applySort(
      itemsFiltered,
      props.sort,
      props.sortDirection,
    )
    const itemsPaginated = await this.applyPagination(
      itemsSorted,
      props.page,
      props.perPage,
    )

    return new SearchResult({
      items: itemsPaginated,
      total: itemsFiltered.length,
      currentPage: props.page,
      perPage: props.perPage,
      sort: props.sort,
      sortDirection: props.sortDirection,
      filter: props.filter,
    })
  }

  protected abstract applyFilter(
    items: E[],
    filter: SearchParams['filter'],
  ): Promise<E[]> // Será implementado pela classe filha

  protected async applySort(
    items: E[],
    sort: string | null,
    sortDirection: SortDirection,
  ): Promise<E[]> {
    if (!sort || !this.sortableFields.includes(sort)) {
      return items
    }

    return [...items].sort((a, b) => {
      const aValue = a.toJSON()[sort]
      const bValue = b.toJSON()[sort]

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const aLower = aValue.toLowerCase()
        const bLower = bValue.toLowerCase()
        if (aLower < bLower) {
          return sortDirection === 'asc' ? -1 : 1
        }
        if (aLower > bLower) {
          return sortDirection === 'asc' ? 1 : -1
        }
        return 0
      }

      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1
      }
      return 0
    })
  }

  protected async applyPagination(
    items: E[],
    page: SearchParams['page'],
    perPage: SearchParams['perPage'],
  ): Promise<E[]> {
    const start = (page - 1) * perPage
    const limit = start + perPage

    return items.slice(start, limit)
  }
}
