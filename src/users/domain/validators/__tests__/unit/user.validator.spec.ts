import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import {
  UserRules,
  UserValidator,
  UserValidatorFactory,
} from '../../user.validator'

let sut: UserValidator
const props = UserDataBuilder({})
describe('UserValidator unit tests', () => {
  beforeEach(() => {
    sut = UserValidatorFactory.create()
  })

  it('Valid cases for validator class', () => {
    const isValid = sut.validate(props)
    expect(isValid).toBeTruthy()
    expect(sut.validatedData).toStrictEqual(new UserRules(props))
  })

  describe('Name field', () => {
    it('Invalidations cases for name field', () => {
      let isValid = sut.validate(null)
      expect(isValid).toBeFalsy()
      expect(sut.errors['name']).toStrictEqual([
        'name should not be empty',
        'name must be a string',
        'name must be shorter than or equal to 255 characters',
      ])

      isValid = sut.validate({ ...props, name: '' })
      expect(isValid).toBeFalsy()
      expect(sut.errors['name']).toStrictEqual(['name should not be empty'])

      isValid = sut.validate({ ...props, name: 1 as any })
      expect(isValid).toBeFalsy()
      expect(sut.errors['name']).toStrictEqual([
        'name must be a string',
        'name must be shorter than or equal to 255 characters',
      ])

      isValid = sut.validate({ ...props, name: 'a'.repeat(256) })
      expect(isValid).toBeFalsy()
      expect(sut.errors['name']).toStrictEqual([
        'name must be shorter than or equal to 255 characters',
      ])
    })
  })

  describe('Email field', () => {
    it('Invalidations cases for email field', () => {
      let isValid = sut.validate(null)
      expect(isValid).toBeFalsy()

      expect(sut.errors['email']).toStrictEqual([
        'email should not be empty',
        'email must be a string',
        'email must be an email',
        'email must be shorter than or equal to 255 characters',
      ])

      isValid = sut.validate({ ...props, email: '' })
      expect(isValid).toBeFalsy()
      expect(sut.errors['email']).toStrictEqual([
        'email should not be empty',
        'email must be an email',
      ])

      isValid = sut.validate({ ...props, email: 1 as any })
      expect(isValid).toBeFalsy()
      expect(sut.errors['email']).toStrictEqual([
        'email must be a string',
        'email must be an email',
        'email must be shorter than or equal to 255 characters',
      ])

      isValid = sut.validate({
        ...props,
        email: 'a'.repeat(256),
      })
      expect(isValid).toBeFalsy()
      expect(sut.errors['email']).toStrictEqual([
        'email must be an email',
        'email must be shorter than or equal to 255 characters',
      ])
    })
  })

  describe('Password field', () => {
    it('Invalidations cases for password field', () => {
      let isValid = sut.validate(null)
      expect(isValid).toBeFalsy()
      expect(sut.errors['password']).toStrictEqual([
        'password should not be empty',
        'password must be a string',
        'password must be shorter than or equal to 100 characters',
      ])

      isValid = sut.validate({ ...props, password: '' })
      expect(isValid).toBeFalsy()
      expect(sut.errors['password']).toStrictEqual([
        'password should not be empty',
      ])

      isValid = sut.validate({ ...props, password: 1 as any })
      expect(isValid).toBeFalsy()
      expect(sut.errors['password']).toStrictEqual([
        'password must be a string',
        'password must be shorter than or equal to 100 characters',
      ])

      isValid = sut.validate({
        ...props,
        password: 'a'.repeat(256),
      })
      expect(isValid).toBeFalsy()
      expect(sut.errors['password']).toStrictEqual([
        'password must be shorter than or equal to 100 characters',
      ])
    })
  })

  describe('CreatedAt field', () => {
    it('Invalidations cases for createdAt field', () => {
      const isValid = sut.validate({ ...props, createdAt: 1 as any })
      expect(isValid).toBeFalsy()
      console.log(sut.errors['createdAt'])

      expect(sut.errors['createdAt']).toStrictEqual([
        'createdAt must be a Date instance',
      ])
    })
  })
})
