import { Entity } from '@/shared/domain/entities/entity'
import { InMemorySearchableRepository } from '../../in-memory-searchable.repository'
import {
  SearchParams,
  SearchResult,
} from '../../searchable-repository-contract'

type StubEntityProps = {
  name: string
  price: number
}

class StubEntity extends Entity<StubEntityProps> {}

class StubInMemorySearchableRepository extends InMemorySearchableRepository<StubEntity> {
  sortableFields: string[] = ['name']

  protected async applyFilter(
    items: StubEntity[],
    filter: SearchParams['filter'],
  ): Promise<StubEntity[]> {
    if (!filter) {
      return items
    }

    return items.filter(item => {
      const filterName = filter['name']
      const filterPrice = filter['price']

      if (typeof filterName === 'string' && typeof filterPrice === 'number') {
        // A depender da lógica de negócio, quando o objeto filter conter mais
        // de uma propriedade, fica como opcional utilizar o operador && ou ||
        return (
          item.toJSON().name.toLowerCase().includes(filterName.toLowerCase()) &&
          item.toJSON().price <= filterPrice
        )
      }
      if (typeof filterName === 'string') {
        return item
          .toJSON()
          .name.toLowerCase()
          .includes(filterName.toLowerCase())
      }

      if (typeof filterPrice === 'number') {
        return item.toJSON().price <= filterPrice
      }
    })
  }
}

describe('InMemorySearchableRepository Unit Tests', () => {
  let sut: StubInMemorySearchableRepository

  beforeEach(() => {
    sut = new StubInMemorySearchableRepository()
  })

  describe('applyFilter method', () => {
    it('should not filter items when filter param is null', async () => {
      const items = [new StubEntity({ name: 'name value', price: 5 })]

      const spyFilterMethod = jest.spyOn(items, 'filter')
      const itemsFiltered = await sut['applyFilter'](items, null)

      expect(itemsFiltered).toStrictEqual(items)
      expect(spyFilterMethod).not.toHaveBeenCalled()
    })

    it('should filter using a filter param', async () => {
      const items = [
        new StubEntity({ name: 'teste', price: 5 }),
        new StubEntity({ name: 'TESTE', price: 1 }),
        new StubEntity({ name: 'fake', price: 10 }),
      ]

      const spyFilterMethod = jest.spyOn(items, 'filter')
      let itemsFilteredByName = await sut['applyFilter'](items, {
        name: 'TESTE',
      })

      expect(itemsFilteredByName).toStrictEqual([items[0], items[1]])
      expect(spyFilterMethod).toHaveBeenCalledTimes(1)

      itemsFilteredByName = await sut['applyFilter'](items, {
        name: 'teste',
      })

      expect(itemsFilteredByName).toStrictEqual([items[0], items[1]])
      expect(spyFilterMethod).toHaveBeenCalledTimes(2)

      itemsFilteredByName = await sut['applyFilter'](items, {
        name: 'Wrong',
      })

      expect(itemsFilteredByName).toHaveLength(0)
      expect(spyFilterMethod).toHaveBeenCalledTimes(3)

      let itemsFilteredByPrice = await sut['applyFilter'](items, { price: 5 })

      expect(itemsFilteredByPrice).toStrictEqual([items[0], items[1]])
      expect(spyFilterMethod).toHaveBeenCalledTimes(4)

      itemsFilteredByPrice = await sut['applyFilter'](items, { price: 0 })

      expect(itemsFilteredByPrice).toHaveLength(0)
      expect(spyFilterMethod).toHaveBeenCalledTimes(5)

      let itemsFilteredByNameAndPrice = await sut['applyFilter'](items, {
        name: 'TESTE',
        price: 5,
      })

      expect(itemsFilteredByNameAndPrice).toStrictEqual([items[0], items[1]])
      expect(spyFilterMethod).toHaveBeenCalledTimes(6)

      itemsFilteredByNameAndPrice = await sut['applyFilter'](items, {
        name: 'Wrong',
        price: 0,
      })

      expect(itemsFilteredByNameAndPrice).toHaveLength(0)
      expect(spyFilterMethod).toHaveBeenCalledTimes(7)
    })
  })
  describe('applySort method', () => {
    it('should not sort items by name when wrong param', async () => {
      const items = [
        new StubEntity({ name: 'B', price: 5 }),
        new StubEntity({ name: 'a', price: 1 }),
      ]

      let itemsSorted = await sut['applySort'](items, null, null)

      expect(itemsSorted).toStrictEqual(items)

      itemsSorted = await sut['applySort'](items, 'wrong', 'desc')

      expect(itemsSorted).toStrictEqual(items)

      itemsSorted = await sut['applySort'](items, 'price', 'desc')

      expect(itemsSorted).toStrictEqual(items)
    })

    it('should sort items by name', async () => {
      const items = [
        new StubEntity({ name: 'B', price: 5 }),
        new StubEntity({ name: 'a', price: 1 }),
        new StubEntity({ name: 'c', price: 10 }),
      ]

      let itemsSorted = await sut['applySort'](items, 'name', 'asc')

      expect(itemsSorted).toStrictEqual([items[1], items[0], items[2]])

      itemsSorted = await sut['applySort'](items, 'name', 'desc')

      expect(itemsSorted).toStrictEqual([items[2], items[0], items[1]])
    })
  })
  describe('applyPagination method', () => {
    it('should paginate items', async () => {
      const items = [
        new StubEntity({ name: 'B', price: 5 }),
        new StubEntity({ name: 'a', price: 1 }),
        new StubEntity({ name: 'c', price: 10 }),
        new StubEntity({ name: 'D', price: 10 }),
        new StubEntity({ name: 'E', price: 10 }),
      ]

      let itemsPaginated = await sut['applyPagination'](items, 1, 2)

      expect(itemsPaginated).toStrictEqual([items[0], items[1]])

      itemsPaginated = await sut['applyPagination'](items, 2, 2)

      expect(itemsPaginated).toStrictEqual([items[2], items[3]])

      itemsPaginated = await sut['applyPagination'](items, 3, 2)

      expect(itemsPaginated).toStrictEqual([items[4]])

      itemsPaginated = await sut['applyPagination'](items, 4, 2)

      expect(itemsPaginated).toStrictEqual([])
    })
  })
  describe('search method', () => {
    it('should apply only pagination when no filter and sort are provided', async () => {
      const entity = new StubEntity({ name: 'Teste', price: 5 })
      const items = Array(16).fill(entity)
      sut.items = items

      const params = await sut.search(new SearchParams())

      expect(params).toStrictEqual(
        new SearchResult({
          items: Array(15).fill(entity),
          total: 16,
          currentPage: 1,
          perPage: 15,
          sort: null,
          sortDirection: null,
          filter: null,
        }),
      )
    })

    it('should apply pagination and filter', async () => {
      const items = [
        new StubEntity({ name: 'test', price: 5 }),
        new StubEntity({ name: 'a', price: 1 }),
        new StubEntity({ name: 'TEST', price: 10 }),
        new StubEntity({ name: 'TeSt', price: 10 }),
      ]
      sut.items = items

      let params = await sut.search(
        new SearchParams({
          page: 1,
          perPage: 2,
          filter: { name: 'test' },
        }),
      )

      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[0], items[2]],
          total: 3,
          currentPage: 1,
          perPage: 2,
          sort: null,
          sortDirection: null,
          filter: { name: 'test' },
        }),
      )

      params = await sut.search(
        new SearchParams({
          page: 2,
          perPage: 2,
          filter: { name: 'test' },
        }),
      )

      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[3]],
          total: 3,
          currentPage: 2,
          perPage: 2,
          sort: null,
          sortDirection: null,
          filter: { name: 'test' },
        }),
      )

      params = await sut.search(
        new SearchParams({
          page: 1,
          perPage: 2,
          filter: { name: 'test', price: 5 },
        }),
      )

      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[0]],
          total: 1,
          currentPage: 1,
          perPage: 2,
          sort: null,
          sortDirection: null,
          filter: { name: 'test', price: 5 },
        }),
      )

      params = await sut.search(
        new SearchParams({
          page: 1,
          perPage: 2,
          filter: { price: 5 },
        }),
      )

      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[0], items[1]],
          total: 2,
          currentPage: 1,
          perPage: 2,
          sort: null,
          sortDirection: null,
          filter: { price: 5 },
        }),
      )
    })

    it('should apply pagination and sort', async () => {
      const items = [
        new StubEntity({ name: 'B', price: 5 }),
        new StubEntity({ name: 'a', price: 1 }),
        new StubEntity({ name: 'D', price: 10 }),
        new StubEntity({ name: 'e', price: 10 }),
        new StubEntity({ name: 'c', price: 10 }),
      ]
      sut.items = items

      let params = await sut.search(
        new SearchParams({
          page: 1,
          perPage: 2,
          sort: 'name',
        }),
      )

      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[3], items[2]],
          total: 5,
          currentPage: 1,
          perPage: 2,
          sort: 'name',
          sortDirection: 'desc',
          filter: null,
        }),
      )

      params = await sut.search(
        new SearchParams({
          page: 2,
          perPage: 2,
          sort: 'name',
        }),
      )

      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[4], items[0]],
          total: 5,
          currentPage: 2,
          perPage: 2,
          sort: 'name',
          sortDirection: 'desc',
          filter: null,
        }),
      )

      params = await sut.search(
        new SearchParams({
          page: 3,
          perPage: 2,
          sort: 'name',
        }),
      )

      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[1]],
          total: 5,
          currentPage: 3,
          perPage: 2,
          sort: 'name',
          sortDirection: 'desc',
          filter: null,
        }),
      )

      params = await sut.search(
        new SearchParams({
          page: 1,
          perPage: 2,
          sort: 'name',
          sortDirection: 'asc',
        }),
      )

      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[1], items[0]],
          total: 5,
          currentPage: 1,
          perPage: 2,
          sort: 'name',
          sortDirection: 'asc',
          filter: null,
        }),
      )

      params = await sut.search(
        new SearchParams({
          page: 2,
          perPage: 2,
          sort: 'name',
          sortDirection: 'asc',
        }),
      )

      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[4], items[2]],
          total: 5,
          currentPage: 2,
          perPage: 2,
          sort: 'name',
          sortDirection: 'asc',
          filter: null,
        }),
      )

      params = await sut.search(
        new SearchParams({
          page: 3,
          perPage: 2,
          sort: 'name',
          sortDirection: 'asc',
        }),
      )

      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[3]],
          total: 5,
          currentPage: 3,
          perPage: 2,
          sort: 'name',
          sortDirection: 'asc',
          filter: null,
        }),
      )
    })

    it('should search using pagination, sort and filter', async () => {
      const items = [
        new StubEntity({ name: 'test', price: 5 }),
        new StubEntity({ name: 'a', price: 1 }),
        new StubEntity({ name: 'TEST', price: 10 }),
        new StubEntity({ name: 'E', price: 1 }),
        new StubEntity({ name: 'TeSt', price: 10 }),
      ]
      sut.items = items

      let params = await sut.search(
        new SearchParams({
          page: 1,
          perPage: 2,
          sort: 'name',
          filter: { name: 'test' },
        }),
      )

      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[0], items[2]],
          total: 3,
          currentPage: 1,
          perPage: 2,
          sort: 'name',
          sortDirection: 'desc',
          filter: { name: 'test' },
        }),
      )

      params = await sut.search(
        new SearchParams({
          page: 2,
          perPage: 2,
          sort: 'name',
          filter: { name: 'test' },
        }),
      )

      expect(params).toStrictEqual(
        new SearchResult({
          items: [items[4]],
          total: 3,
          currentPage: 2,
          perPage: 2,
          sort: 'name',
          sortDirection: 'desc',
          filter: { name: 'test' },
        }),
      )
    })
  })
})
