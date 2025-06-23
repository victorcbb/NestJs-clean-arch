import { randomUUID } from 'node:crypto'

type EntityJSON<T> = { id: string } & T

export abstract class Entity<Props> {
  private readonly _id: string
  protected readonly props: Props

  constructor(props: Props, id?: string) {
    this._id = id ?? randomUUID()
    this.props = props
  }

  get id(): string {
    return this._id
  }

  toJSON(): Required<EntityJSON<Props>> {
    return {
      id: this.id,
      ...this.props,
    } as Required<EntityJSON<Props>>
  }
}
