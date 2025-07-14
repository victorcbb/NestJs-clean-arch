import { Entity } from '../entities/entity'
import { RepositoryInterface } from './repository-contract'

export type SortDirection = 'asc' | 'desc'
export type SearchProps<Filter = { [key: string]: any }> = {
  page?: number
  perPage?: number
  sort?: string | null
  sortDirection?: SortDirection | null
  filter?: Filter | null
}

export class SearchParams<Filter = { [key: string]: any }> {
  protected _page = 1
  protected _perPage = 15
  protected _sort: string | null
  protected _sortDirection: SortDirection | null
  protected _filter: Filter | null

  constructor(props: SearchProps<Filter> = {}) {
    this.page = props.page
    this.perPage = props.perPage
    this.sort = props.sort ?? null
    this.sortDirection = props.sortDirection ?? null
    this.filter = props.filter ?? null
  }

  get page(): number {
    return this._page
  }

  private set page(value: number) {
    let _page = +value // adiciona o operador + para converter em número
    if (
      Number.isNaN(_page) ||
      _page < 1 ||
      parseInt(_page.toString()) !== _page
    ) {
      _page = 1
    }

    this._page = _page
  }

  get perPage(): number {
    return this._perPage
  }

  private set perPage(value: number) {
    let _perPage = +value // adiciona o operador + para converter em número
    if (
      Number.isNaN(_perPage) ||
      _perPage < 1 ||
      parseInt(_perPage.toString()) !== _perPage ||
      typeof value === 'boolean'
    ) {
      _perPage = 15
    }

    this._perPage = _perPage
  }

  get sort(): string | null {
    return this._sort
  }

  private set sort(value: string | null) {
    this._sort =
      value === null || value === undefined || value === ''
        ? null
        : `${value}`.trim()
  }

  get sortDirection(): SortDirection | null {
    return this._sortDirection
  }

  private set sortDirection(value: SortDirection | null) {
    if (!this._sort) {
      this._sortDirection = null
      return
    }

    const dir = `${value}`.toLowerCase()

    this._sortDirection = dir === 'asc' || dir === 'desc' ? dir : 'desc'
  }

  get filter(): Filter | null {
    return this._filter
  }

  private set filter(value: Filter | null) {
    this._filter =
      value === null ||
      value === undefined ||
      typeof value !== 'object' ||
      (typeof value === 'object' && Object.keys(value).length === 0)
        ? null
        : value
  }
}

export interface SearchableRepositoryInterface<
  E extends Entity,
  SearchInput,
  SearchOutput,
> extends RepositoryInterface<E> {
  search(props: SearchInput): Promise<SearchOutput>
}
