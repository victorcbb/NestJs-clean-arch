import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserOutputMapper } from '../../user-output'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'

describe('UserOutputMapper Unit Tests', () => {
  it('should convert a user in output', () => {
    const entity = new UserEntity(UserDataBuilder({}))
    const spyToJSON = jest.spyOn(entity, 'toJSON')

    const sut = UserOutputMapper.toOutput(entity)

    expect(spyToJSON).toHaveBeenCalled()
    expect(sut).toStrictEqual({
      id: entity.id,
      name: entity.name,
      email: entity.email,
      createdAt: entity.createdAt,
    })
  })
})
