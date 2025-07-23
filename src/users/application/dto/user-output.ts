import { UserEntity } from '@/users/domain/entities/user.entity'

export type UserOutput = {
  id: string
  name: string
  email: string
  createdAt: Date
}

export class UserOutputMapper {
  static toOutput(entity: UserEntity): UserOutput {
    return {
      id: entity.toJSON().id,
      name: entity.toJSON().name,
      email: entity.toJSON().email,
      createdAt: entity.toJSON().createdAt,
    }
  }
}
