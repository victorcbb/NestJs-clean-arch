import { UserRepositoory } from '@/users/domain/repositories/user.repository'
import { NotFoundError } from '../../../shared/application/errors/not-found-error'
import { UserOutput, UserOutputMapper } from '../dto/user-output'
import { UseCase } from '@/shared/application/usecases/use-case'
import { InvalidPasswordError } from '@/shared/application/errors/invalid-password-error'
import { HashProvider } from '@/shared/application/providers/hash-provider'

export type UpdatePasswordInput = {
  id: string
  password: string
  oldPassword: string
}

export type UpdatePasswordOutput = UserOutput

export class UpdatePasswordUseCase
  implements UseCase<UpdatePasswordInput, UpdatePasswordOutput>
{
  constructor(
    private userRepository: UserRepositoory,
    private hashProvider: HashProvider,
  ) {}

  async execute(input: UpdatePasswordInput): Promise<UpdatePasswordOutput> {
    if (!input.password || !input.oldPassword) {
      throw new InvalidPasswordError(
        'Old password or new password not provided',
      )
    }

    const user = await this.userRepository.findById(input.id)

    if (!user) {
      throw new NotFoundError('User not found')
    }

    const checkOldPassword = await this.hashProvider.compareHash(
      input.oldPassword,
      user.password,
    )

    if (!checkOldPassword) {
      throw new InvalidPasswordError('Old password does not match')
    }

    const passwordHash = await this.hashProvider.generateHash(input.password)

    user.updatePassword(passwordHash)

    await this.userRepository.update(user)

    return UserOutputMapper.toOutput(user)
  }
}
