import { Module } from '@nestjs/common'
import { UsersController } from './users.controller'
import { SignUpUseCase } from '../application/usecases/signup.usecase'
import { UserInMemoryRepository } from './database/in-memory/repositories/user-in-memory.repository'
import { BcryptJsHashProvider } from './providers/hash-provider/bcryptjs-hash.provider'
import { UserRepositoory } from '../domain/repositories/user.repository'
import { HashProvider } from '@/shared/application/providers/hash-provider'
import { SignInUseCase } from '../application/usecases/signin.usecase'
import { GetUserUseCase } from '../application/usecases/getuser.usecase'
import { ListUsersUseCase } from '../application/usecases/listusers.usecase'
import { UpdateUserUseCase } from '../application/usecases/updateuser.usecase'
import { UpdatePasswordUseCase } from '../application/usecases/updatepassword.usecase'
import { DeleteUserUseCase } from '../application/usecases/deleteuser.usecase'

@Module({
  controllers: [UsersController],
  providers: [
    {
      provide: 'UserRepository',
      useClass: UserInMemoryRepository,
    },
    {
      provide: 'HashProvider',
      useClass: BcryptJsHashProvider,
    },
    {
      provide: SignUpUseCase,
      useFactory: (
        userRepository: UserRepositoory,
        hashProvider: HashProvider,
      ) => {
        return new SignUpUseCase(userRepository, hashProvider)
      },
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: SignInUseCase,
      useFactory: (
        userRepository: UserRepositoory,
        hashProvider: HashProvider,
      ) => {
        return new SignInUseCase(userRepository, hashProvider)
      },
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: GetUserUseCase,
      useFactory: (userRepository: UserRepositoory) => {
        return new GetUserUseCase(userRepository)
      },
      inject: ['UserRepository'],
    },
    {
      provide: ListUsersUseCase,
      useFactory: (userRepository: UserRepositoory) => {
        return new ListUsersUseCase(userRepository)
      },
      inject: ['UserRepository'],
    },
    {
      provide: UpdateUserUseCase,
      useFactory: (userRepository: UserRepositoory) => {
        return new UpdateUserUseCase(userRepository)
      },
      inject: ['UserRepository'],
    },
    {
      provide: UpdatePasswordUseCase,
      useFactory: (
        userRepository: UserRepositoory,
        hashProvider: HashProvider,
      ) => {
        return new UpdatePasswordUseCase(userRepository, hashProvider)
      },
      inject: ['UserRepository', 'HashProvider'],
    },
    {
      provide: DeleteUserUseCase,
      useFactory: (userRepository: UserRepositoory) => {
        return new DeleteUserUseCase(userRepository)
      },
      inject: ['UserRepository'],
    },
  ],
})
export class UsersModule {}
