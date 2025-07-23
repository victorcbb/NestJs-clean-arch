import { UserRepositoory } from '@/users/domain/repositories/user.repository'
import { BadRequestError } from '../../../shared/application/errors/bad-request-error'
import { HashProvider } from '@/shared/application/providers/hash-provider'
import { UserOutput, UserOutputMapper } from '../dto/user-output'
import { UseCase } from '@/shared/application/usecases/use-case'
import { NotFoundError } from '@/shared/application/errors/not-found-error'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'

export type SignInInput = {
  email: string
  password: string
}

export type SignInOutput = UserOutput

export class SignInUseCase implements UseCase<SignInInput, SignInOutput> {
  constructor(
    private userRepository: UserRepositoory,
    private hashProvider: HashProvider,
  ) {}

  async execute(input: SignInInput): Promise<SignInOutput> {
    const { email, password } = input

    if (!email || !password) {
      throw new BadRequestError('Input data not provided')
    }

    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      throw new NotFoundError(`User with email ${email} not found`)
    }

    const passwordHashMatch = await this.hashProvider.compareHash(
      password,
      user.password,
    )

    if (!passwordHashMatch) {
      throw new InvalidCredentialsError('Invalid credentials')
    }

    return UserOutputMapper.toOutput(user)
  }
}
