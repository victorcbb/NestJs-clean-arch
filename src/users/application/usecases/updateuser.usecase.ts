import { UserRepositoory } from '@/users/domain/repositories/user.repository'
import { NotFoundError } from '../../../shared/application/errors/not-found-error'
import { UserOutput, UserOutputMapper } from '../dto/user-output'
import { UseCase } from '@/shared/application/usecases/use-case'
import { BadRequestError } from '@/shared/application/errors/bad-request-error'

export type UpdateUserInput = {
  id: string
  name?: string
}

export type UpdateUserOutput = UserOutput

export class UpdateUserUseCase
  implements UseCase<UpdateUserInput, UpdateUserOutput>
{
  constructor(private userRepository: UserRepositoory) {}

  async execute(input: UpdateUserInput): Promise<UpdateUserOutput> {
    if (!input.name) {
      throw new BadRequestError('Name not provided')
    }

    const user = await this.userRepository.findById(input.id)

    if (!user) {
      throw new NotFoundError('User not found')
    }

    user.updateName(input.name)

    await this.userRepository.update(user)

    return UserOutputMapper.toOutput(user)
  }
}
