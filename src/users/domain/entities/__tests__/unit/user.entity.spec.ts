import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserEntity, UserProps } from '../../user.entity'

describe('UserEntity unit test', () => {
  let props: UserProps
  let sut: UserEntity

  beforeEach(() => {
    props = UserDataBuilder({})

    sut = new UserEntity(props)
  })

  it('Constructor method', () => {
    expect(sut.name).toBe(props.name)
    expect(sut.email).toBe(props.email)
    expect(sut.password).toBe(props.password)
    expect(sut.createdAt).toBeInstanceOf(Date)
  })

  it('Getter of name field', () => {
    expect(sut.name).toBeDefined()
    expect(sut.name).toBe(props.name)
    expect(typeof sut.name).toBe('string')
  })

  it('Setter of name field', () => {
    const name = 'New Name'
    sut['name'] = name

    expect(sut.name).toBe(name)
    expect(typeof sut.name).toBe('string')
  })

  it('Getter of email field', () => {
    expect(sut.email).toBeDefined()
    expect(sut.email).toBe(props.email)
    expect(typeof sut.email).toBe('string')
  })

  it('Setter of email field', () => {
    const email = 'New email'
    sut['email'] = email

    expect(sut.email).toBe(email)
    expect(typeof sut.email).toBe('string')
  })

  it('Getter of password field', () => {
    // O ideal seria ter o password criptografado e ter um método para verificar se a senha informada é igual a senha do usuário
    expect(sut.password).toBeDefined()
    expect(sut.password).toBe(props.password)
    expect(typeof sut.password).toBe('string')
  })

  it('Setter of password field', () => {
    const password = 'New password'
    sut['password'] = password

    expect(sut.password).toBe(password)
    expect(typeof sut.password).toBe('string')
  })

  it('Getter of createdAt field', () => {
    expect(sut.createdAt).toBeDefined()
    expect(sut.createdAt).toBeInstanceOf(Date)
  })

  it('Should update the user name', () => {
    const updatedName = 'Updated Name'
    sut.updateName(updatedName)

    expect(sut.name).toBe(updatedName)
  })

  it('Should update the user password', () => {
    const updatedPassword = 'Updated password'
    sut.updatePassword(updatedPassword)

    expect(sut.password).toBe(updatedPassword)
  })
})
