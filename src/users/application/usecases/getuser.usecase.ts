import { UserRepositoory } from '@/users/domain/repositories/user.repository'
import { NotFoundError } from '../../../shared/application/errors/not-found-error'
import { UserOutput, UserOutputMapper } from '../dto/user-output'
import { UseCase } from '@/shared/application/usecases/use-case'

export type GetUserInput = {
  id: string
}

export type GetUserOutput = UserOutput

export class GetUserUseCase implements UseCase<GetUserInput, GetUserOutput> {
  constructor(private userRepository: UserRepositoory) {}

  async execute(input: GetUserInput): Promise<GetUserOutput> {
    const user = await this.userRepository.findById(input.id)

    if (!user) {
      throw new NotFoundError('User not found')
    }

    return UserOutputMapper.toOutput(user)
  }
}
