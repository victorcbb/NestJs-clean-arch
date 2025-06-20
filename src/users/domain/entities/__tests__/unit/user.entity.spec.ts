import { faker } from '@faker-js/faker'
import { UserEntity, UserProps } from '../../user.entity'

describe('UserEntity unit test', () => {
  let props: UserProps
  let sut: UserEntity

  beforeEach(() => {
    props = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    }

    sut = new UserEntity(props)
  })

  it('Constructor method', () => {
    expect(sut.props.name).toBe(props.name)
    expect(sut.props.email).toBe(props.email)
    expect(sut.props.password).toBe(props.password)
    expect(sut.props.createdAt).toBeInstanceOf(Date)
  })
})
