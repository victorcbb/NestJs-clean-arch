import { Entity } from '@/shared/domain/entities/entity'
import { InMemoryRepository } from '../../in-memory.repository'

type StubEntityProps = {
  name: string
  price: number
}

class StubEntity extends Entity<StubEntityProps> {}

class StubInMemoryRepository extends InMemoryRepository<StubEntity> {}

describe('InMemoryRepository Unit Tests', () => {
  let sut: StubInMemoryRepository

  beforeEach(() => {
    sut = new StubInMemoryRepository()
  })

  it('Should insert a new entity', async () => {
    const entity = new StubEntity({ name: 'Test', price: 100 })

    await sut.insert(entity)

    expect(entity.toJSON()).toStrictEqual(sut.items[0].toJSON())
  })

  it('Should return null when entity not found', async () => {
    const entity = new StubEntity({ name: 'Test', price: 100 })

    await sut.insert(entity)

    expect(await sut.findById('non-existing-id')).toBeNull()
  })

  it('Should find an entity by id', async () => {
    const entity = new StubEntity({ name: 'Test', price: 100 })

    await sut.insert(entity)

    const result = await sut.findById(entity.id)

    expect(entity.toJSON()).toStrictEqual(result.toJSON())
  })

  it('Should find all entities', async () => {
    const entity = new StubEntity({ name: 'Test', price: 100 })

    await sut.insert(entity)

    const result = await sut.findAll()
    expect(result).toHaveLength(1)
    expect(result[0].toJSON()).toStrictEqual(entity.toJSON())
  })

  it('Should fail on update when entity not found', async () => {
    const entity = new StubEntity({ name: 'Test', price: 100 })

    await sut.insert(entity)
    const updatedEntity = new StubEntity(
      { name: 'Updated', price: 200 },
      'non-existing-id',
    )

    await sut.update(updatedEntity)

    expect(sut.items[0].toJSON()).not.toStrictEqual(updatedEntity.toJSON())
  })

  it('Should update an entity', async () => {
    const entity = new StubEntity({ name: 'Test', price: 100 })

    await sut.insert(entity)
    const updatedEntity = new StubEntity(
      { name: 'Updated', price: 200 },
      entity.id,
    )

    await sut.update(updatedEntity)

    expect(sut.items[0].toJSON()).toStrictEqual(updatedEntity.toJSON())
  })

  it('Should fail on delete when entity not found', async () => {
    const entity = new StubEntity({ name: 'Test', price: 100 })

    await sut.insert(entity)

    await sut.delete('non-existing-id')

    expect(sut.items).toHaveLength(1)
  })

  it('Should delete an entity', async () => {
    const entity = new StubEntity({ name: 'Test', price: 100 })

    await sut.insert(entity)

    await sut.delete(entity.id)

    expect(sut.items).toHaveLength(0)
  })
})
