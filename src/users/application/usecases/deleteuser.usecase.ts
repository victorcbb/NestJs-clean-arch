import { UserRepositoory } from '@/users/domain/repositories/user.repository'
import { NotFoundError } from '../../../shared/application/errors/not-found-error'
import { UseCase } from '@/shared/application/usecases/use-case'

export type DeleteUserInput = {
  id: string
}

export type DeleteUserOutput = void

export class DeleteUserUseCase
  implements UseCase<DeleteUserInput, DeleteUserOutput>
{
  constructor(private userRepository: UserRepositoory) {}

  async execute(input: DeleteUserInput): Promise<DeleteUserOutput> {
    const user = await this.userRepository.findById(input.id)

    if (!user) {
      throw new NotFoundError('User not found')
    }

    await this.userRepository.delete(input.id)
  }
}
