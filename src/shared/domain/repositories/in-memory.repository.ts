import { Entity } from '../entities/entity'
import { RepositoryInterface } from './repository-contract'

export abstract class InMemoryRepository<E extends Entity>
  implements RepositoryInterface<E>
{
  item: E[] = []

  async insert(entity: E): Promise<void> {
    this.item.push(entity)
  }

  async findById(id: string) {
    return this._get(id)
  }

  async findAll(): Promise<E[]> {
    return this.item
  }

  async update(entity: E): Promise<void> {
    const index = await this._getIndex(entity.id)

    this.item[index] = entity
  }

  async delete(id: string): Promise<void> {
    const index = await this._getIndex(id)
    if (index >= 0) {
      this.item.splice(index, 1)
    }
  }

  async _get(id: string): Promise<E | null> {
    const _id = `${id}`
    const entity = this.item.find(item => item.id === _id)

    if (!entity) {
      return null
    }

    return entity
  }

  async _getIndex(id: string): Promise<number> {
    const _id = `${id}`
    const index = this.item.findIndex(item => item.id === _id)

    return index
  }
}
