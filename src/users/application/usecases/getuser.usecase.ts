import { UserRepositoory } from '@/users/domain/repositories/user.repository'
import { NotFoundError } from '../errors/not-found-error'
import { UserOutput } from '../dto/user-output'

export type GetUserInput = {
  id: string
}

export type GetUserOutput = UserOutput

export class GetUserUseCase {
  constructor(private userRepository: UserRepositoory) {}

  async execute(input: GetUserInput): Promise<GetUserOutput> {
    const user = await this.userRepository.findById(input.id)

    if (!user) {
      throw new NotFoundError('User not found')
    }

    return {
      id: user.toJSON().id,
      name: user.toJSON().name,
      email: user.toJSON().email,
      createdAt: user.toJSON().createdAt,
    }
  }
}
