import { SearchResult } from '@/shared/domain/repositories/searchable-repository-contract'
import { PaginationOutputMapper } from '../pagination-output'

describe('PaginationOutputMapper Unit Tests', () => {
  it('should convert a search result in output', () => {
    const result = new SearchResult({
      items: [{ name: 'fake' }] as any,
      total: 1,
      currentPage: 1,
      perPage: 1,
      sort: '',
      sortDirection: null,
      filter: { name: 'fake' },
    })

    const sut = PaginationOutputMapper.toOutput(result.items, result)

    expect(sut).toStrictEqual({
      items: [{ name: 'fake' }],
      total: 1,
      currentPage: 1,
      lastPage: 1,
      perPage: 1,
    })
  })
})
