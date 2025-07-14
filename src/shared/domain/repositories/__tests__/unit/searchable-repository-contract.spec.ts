import {
  SearchParams,
  SearchResult,
} from '../../searchable-repository-contract'

describe('Searchable Repository unit tests', () => {
  describe('SearchParams tests', () => {
    it('Should test page prop', () => {
      const sut = new SearchParams()
      expect(sut.page).toBe(1)

      const params = [
        { input: null, output: 1 },
        { input: undefined, output: 1 },
        { input: '', output: 1 },
        { input: 'a', output: 1 },
        { input: '0', output: 1 },
        { input: '-1', output: 1 },
        { input: '2.5', output: 1 },
        { input: true, output: 1 },
        { input: false, output: 1 },
        { input: {}, output: 1 },
        { input: 1, output: 1 },
        { input: '2', output: 2 },
        { input: 0, output: 1 },
        { input: -1, output: 1 },
        { input: 2.5, output: 1 },
        { input: 2, output: 2 },
      ]

      params.forEach(param => {
        const sut = new SearchParams({ page: param.input as any })
        expect(sut.page).toBe(param.output)
      })
    })

    it('Should test perPage prop', () => {
      const sut = new SearchParams()
      expect(sut.perPage).toBe(15)

      const params = [
        { input: null, output: 15 },
        { input: undefined, output: 15 },
        { input: '', output: 15 },
        { input: 'a', output: 15 },
        { input: '0', output: 15 },
        { input: '-1', output: 15 },
        { input: '2.5', output: 15 },
        { input: true, output: 15 },
        { input: false, output: 15 },
        { input: {}, output: 15 },
        { input: 15, output: 15 },
        { input: '2', output: 2 },
        { input: 0, output: 15 },
        { input: -1, output: 15 },
        { input: 2.5, output: 15 },
        { input: 20, output: 20 },
      ]

      params.forEach(param => {
        const sut = new SearchParams({ perPage: param.input as any })
        expect(sut.perPage).toBe(param.output)
      })
    })

    it('Should test sort prop', () => {
      const sut = new SearchParams()
      expect(sut.sort).toBeNull()

      const params = [
        { input: null, output: null },
        { input: undefined, output: null },
        { input: '', output: null },
        { input: 'Test', output: 'Test' },
        { input: 0, output: '0' },
        { input: true, output: 'true' },
        { input: false, output: 'false' },
        { input: {}, output: '[object Object]' },
      ]

      params.forEach(param => {
        const sut = new SearchParams({ sort: param.input as any })
        expect(sut.sort).toBe(param.output)
      })
    })

    it('Should test sortDirection prop', () => {
      let sut = new SearchParams()
      expect(sut.sortDirection).toBeNull()

      sut = new SearchParams({ sort: null, sortDirection: 'asc' })
      expect(sut.sortDirection).toBeNull()

      sut = new SearchParams({ sort: undefined, sortDirection: 'asc' })
      expect(sut.sortDirection).toBeNull()

      sut = new SearchParams({ sort: '', sortDirection: 'asc' })
      expect(sut.sortDirection).toBeNull()

      const params = [
        { input: null, output: 'desc' },
        { input: undefined, output: 'desc' },
        { input: '', output: 'desc' },
        { input: 'Test', output: 'desc' },
        { input: 'desc', output: 'desc' },
        { input: 'DESC', output: 'desc' },
        { input: 'asc', output: 'asc' },
        { input: 'ASC', output: 'asc' },
        { input: 0, output: 'desc' },
        { input: 1, output: 'desc' },
        { input: 2, output: 'desc' },
        { input: -2, output: 'desc' },
        { input: true, output: 'desc' },
        { input: false, output: 'desc' },
        { input: {}, output: 'desc' },
      ]

      params.forEach(param => {
        const sut = new SearchParams({
          sort: 'field',
          sortDirection: param.input as any,
        })
        expect(sut.sortDirection).toBe(param.output)
      })
    })

    it('Should test filter prop', () => {
      const sut = new SearchParams()
      expect(sut.filter).toBeNull()

      const params = [
        { input: null, output: null },
        { input: undefined, output: null },
        { input: '', output: null },
        { input: 'Test', output: null },
        { input: 20, output: null },
        { input: {}, output: null },
        { input: { key: 'value' }, output: { key: 'value' } },
        { input: { key: 14 }, output: { key: 14 } },
        { input: { key: true }, output: { key: true } },
        {
          input: { key: 'value', key2: 10, key3: true },
          output: { key: 'value', key2: 10, key3: true },
        },
      ]

      params.forEach(param => {
        const sut = new SearchParams({ filter: param.input as any })
        expect(sut.filter).toEqual(param.output)
      })
    })
  })

  describe('SearchResult tests', () => {
    it('constructor props', () => {
      let sut = new SearchResult({
        items: ['entity1', 'entity2', 'entity3', 'entity4'] as any,
        currentPage: 1,
        perPage: 2,
        total: 4,
        sort: null,
        sortDirection: null,
        filter: null,
      })
      expect(sut.toJSON()).toStrictEqual({
        items: ['entity1', 'entity2', 'entity3', 'entity4'],
        currentPage: 1,
        perPage: 2,
        total: 4,
        lastPage: 2,
        sort: null,
        sortDirection: null,
        filter: null,
      })

      sut = new SearchResult({
        items: ['entity1', 'entity2', 'entity3', 'entity4'] as any,
        currentPage: 1,
        perPage: 2,
        total: 4,
        sort: 'name',
        sortDirection: 'asc',
        filter: { key: 'test' },
      })
      expect(sut.toJSON()).toStrictEqual({
        items: ['entity1', 'entity2', 'entity3', 'entity4'],
        currentPage: 1,
        perPage: 2,
        total: 4,
        lastPage: 2,
        sort: 'name',
        sortDirection: 'asc',
        filter: { key: 'test' },
      })

      sut = new SearchResult({
        items: ['entity1', 'entity2', 'entity3', 'entity4'] as any,
        currentPage: 1,
        perPage: 10,
        total: 4,
        sort: 'name',
        sortDirection: 'asc',
        filter: { key: 'test' },
      })
      expect(sut.lastPage).toBe(1)

      sut = new SearchResult({
        items: ['entity1', 'entity2', 'entity3', 'entity4'] as any,
        currentPage: 1,
        perPage: 10,
        total: 54,
        sort: 'name',
        sortDirection: 'asc',
        filter: { key: 'test' },
      })
      expect(sut.lastPage).toBe(6)
    })
  })
})
