import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
import { UserEntity, UserProps } from '../../user.entity'
import { EntityValidationError } from '@/shared/domain/errors/validation-error'

describe('UserEntity integration tests', () => {
  describe('Constructor method', () => {
    it('Should throw an error when creating a user with invalid name', () => {
      let props: UserProps = {
        ...UserDataBuilder({}),
        name: null,
      }

      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = {
        ...UserDataBuilder({}),
        name: '',
      }

      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = {
        ...UserDataBuilder({}),
        name: 1 as any,
      }

      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = {
        ...UserDataBuilder({}),
        name: 'a'.repeat(256),
      }

      expect(() => new UserEntity(props)).toThrow(EntityValidationError)
    })

    it('Should throw an error when creating a user with invalid email', () => {
      let props: UserProps = {
        ...UserDataBuilder({}),
        email: null,
      }

      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = {
        ...UserDataBuilder({}),
        email: '',
      }

      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = {
        ...UserDataBuilder({}),
        email: 1 as any,
      }

      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = {
        ...UserDataBuilder({}),
        email: 'a'.repeat(256),
      }

      expect(() => new UserEntity(props)).toThrow(EntityValidationError)
    })

    it('Should throw an error when creating a user with invalid password', () => {
      let props: UserProps = {
        ...UserDataBuilder({}),
        password: null,
      }

      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = {
        ...UserDataBuilder({}),
        password: '',
      }

      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = {
        ...UserDataBuilder({}),
        password: 1 as any,
      }

      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = {
        ...UserDataBuilder({}),
        password: 'a'.repeat(101),
      }

      expect(() => new UserEntity(props)).toThrow(EntityValidationError)
    })

    it('Should throw an error when creating a user with invalid createdAt', () => {
      const props: UserProps = {
        ...UserDataBuilder({}),
        createdAt: '2025' as any,
      }

      expect(() => new UserEntity(props)).toThrow(EntityValidationError)
    })

    it('Should a valid user', () => {
      expect.assertions(0)
      const props: UserProps = {
        ...UserDataBuilder({}),
      }

      new UserEntity(props)
    })

    it('Should throw an error when creating a user with invalid name', () => {
      let props: UserProps = {
        ...UserDataBuilder({}),
        name: null,
      }

      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = {
        ...UserDataBuilder({}),
        name: '',
      }

      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = {
        ...UserDataBuilder({}),
        name: 1 as any,
      }

      expect(() => new UserEntity(props)).toThrow(EntityValidationError)

      props = {
        ...UserDataBuilder({}),
        name: 'a'.repeat(256),
      }

      expect(() => new UserEntity(props)).toThrow(EntityValidationError)
    })
  })

  describe('Update method', () => {
    let userEntity: UserEntity

    beforeEach(() => {
      userEntity = new UserEntity(UserDataBuilder({}))
    })

    it('Should throw an error when update a user with invalid name', () => {
      expect(() => userEntity.updateName(null)).toThrow(EntityValidationError)
      expect(() => userEntity.updateName('')).toThrow(EntityValidationError)
      expect(() => userEntity.updateName(1 as any)).toThrow(
        EntityValidationError,
      )
      expect(() => userEntity.updateName('a'.repeat(256))).toThrow(
        EntityValidationError,
      )
    })

    it('Should a valid user', () => {
      expect.assertions(0)
      userEntity.updateName('Valid Name')
    })
  })
})
