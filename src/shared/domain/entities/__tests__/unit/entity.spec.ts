import { isUUUIDValidV4 } from '@/shared/utils/uuid'
import { Entity } from '../../entity'

type StubProps = {
  prop1: string
  prop2: number
}

class StubEntity extends Entity<StubProps> {}

describe('Entity unit test', () => {
  it('Should set props and id', () => {
    const props = { prop1: 'value1', prop2: 123 }
    const entity = new StubEntity(props)

    expect(entity.toJSON()).toHaveProperty('prop1', props.prop1)
    expect(entity.toJSON()).toHaveProperty('prop2', props.prop2)
    expect(entity.id).not.toBeNull()
    expect(isUUUIDValidV4(entity.id)).toBeTruthy()
  })

  it('Should accept a valid uuid', () => {
    const props = { prop1: 'value1', prop2: 123 }
    const id = '4c0e72bc-2142-4d70-ad99-8ff603ccc0a9'
    const entity = new StubEntity(props, id)

    expect(isUUUIDValidV4(entity.id)).toBeTruthy()
    expect(entity.id).toBe(id)
  })

  it('Should convert a entity to a JSON', () => {
    const props = { prop1: 'value1', prop2: 123 }
    const id = '4c0e72bc-2142-4d70-ad99-8ff603ccc0a9'
    const entity = new StubEntity(props, id)

    expect(entity.toJSON()).toStrictEqual({
      id,
      ...props,
    })
  })
})
