import { UserRepositoory } from '@/users/domain/repositories/user.repository'
import { BadRequestError } from '../errors/bad-request-error'
import { UserEntity } from '@/users/domain/entities/user.entity'

import { ConflictError } from '../errors/conflict-error'
import { HashProvider } from '@/shared/application/providers/hash-provider'

export type SignUpInput = {
  name: string
  email: string
  password: string
}

export type SignUpOutput = {
  id: string
  name: string
  email: string
  createdAt: Date
}

export class SignUpUseCase {
  constructor(
    private userRepository: UserRepositoory,
    private hashProvider: HashProvider,
  ) {}

  async execute(input: SignUpInput): Promise<SignUpOutput> {
    const { name, email, password } = input

    if (!name || !email || !password) {
      throw new BadRequestError('Input data not provided')
    }

    const emailExists = await this.userRepository.emailExists(email)

    if (emailExists) {
      throw new ConflictError('Email already in use')
    }

    const passwordHash = await this.hashProvider.generateHash(password)

    const user = new UserEntity(
      Object.assign(input, { password: passwordHash }),
    )

    await this.userRepository.insert(user)

    return {
      id: user.toJSON().id,
      name: user.toJSON().name,
      email: user.toJSON().email,
      createdAt: user.toJSON().createdAt,
    }
  }
}
