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
    expect(sut.getName()).toBe(props.name)
    expect(sut.getEmail()).toBe(props.email)
    expect(sut.getPassword()).toBe(props.password)
    expect(sut.getCreatedAt()).toBeInstanceOf(Date)
  })

  it('Getter of name field', () => {
    expect(sut.getName()).toBeDefined()
    expect(sut.getName()).toBe(props.name)
    expect(typeof sut.getName()).toBe('string')
  })

  it('Getter of password field', () => {
    // O ideal seria ter o password criptografado e ter um método para verificar se a senha informada é igual a senha do usuário
    expect(sut.getPassword()).toBeDefined()
    expect(sut.getPassword()).toBe(props.password)
    expect(typeof sut.getPassword()).toBe('string')
  })

  it('Getter of createdAt field', () => {
    expect(sut.getCreatedAt()).toBeDefined()
    expect(sut.getCreatedAt()).toBeInstanceOf(Date)
  })
})
