import { Entity } from '@/shared/domain/entities/entity'
import { InMemorySearchableRepository } from '../../in-memory-searchable.repository'
import { SearchParams } from '../../searchable-repository-contract'

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
  describe('applySort method', () => {})
  describe('applyPaginate method', () => {})
  describe('search method', () => {})
})
