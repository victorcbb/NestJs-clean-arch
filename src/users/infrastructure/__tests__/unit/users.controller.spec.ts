import { SignUpOutput } from '@/users/application/usecases/signup.usecase'
import { UsersController } from '../../users.controller'
import { UserOutput } from '@/users/application/dto/user-output'
import { SignInOutput } from '@/users/application/usecases/signin.usecase'
import { UpdatePasswordOutput } from '@/users/application/usecases/updatepassword.usecase'
import { UpdateUserOutput } from '@/users/application/usecases/updateuser.usecase'
import { UpdateUserDto } from '../../dtos/update-user.dto'
import { SignInDto } from '../../dtos/signin.dto'
import { SignUpDto } from '../../dtos/signup.dto'
import { UpdatePasswordDto } from '../../dtos/update-password.dto'
import { DeleteUserOutput } from '@/users/application/usecases/deleteuser.usecase'
import { GetUserOutput } from '@/users/application/usecases/getuser.usecase'
import { ListUsersOutput } from '@/users/application/usecases/listusers.usecase'
import { ListUsersDto } from '../../dtos/list-users.dto'

describe('UsersController unit tests', () => {
  let sut: UsersController
  let id: string
  let props: UserOutput

  beforeEach(async () => {
    sut = new UsersController()
    id = 'a2089105-380e-4015-974e-0dbd7ee9393c'
    props = {
      id,
      name: 'John Doe',
      email: 'john.doe@example.com',
      createdAt: new Date(),
    }
  })

  it('should be defined', () => {
    expect(sut).toBeDefined()
  })

  it('should create a user', async () => {
    const output: SignUpOutput = props
    const mockSignUpUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }

    sut['signUpUseCase'] = mockSignUpUseCase as any

    const input: SignUpDto = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    }

    const result = await sut.create(input)

    expect(output).toMatchObject(result)
    expect(mockSignUpUseCase.execute).toHaveBeenCalledWith(input)
  })

  it('should authenticate a user', async () => {
    const output: SignInOutput = props
    const mockSignInUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }

    sut['signInUseCase'] = mockSignInUseCase as any

    const input: SignInDto = {
      email: 'john.doe@example.com',
      password: '123456',
    }

    const result = await sut.login(input)

    expect(output).toMatchObject(result)
    expect(mockSignInUseCase.execute).toHaveBeenCalledWith(input)
  })

  it('should update a user', async () => {
    const output: UpdateUserOutput = props
    const mockUpdateUserUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }

    sut['updateUserUseCase'] = mockUpdateUserUseCase as any

    const input: UpdateUserDto = {
      name: 'New Name',
    }

    const result = await sut.update(id, input)

    expect(output).toMatchObject(result)
    expect(mockUpdateUserUseCase.execute).toHaveBeenCalledWith({ id, ...input })
  })

  it('should update a user password', async () => {
    const output: UpdatePasswordOutput = props
    const mockUpdatePasswordUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }

    sut['updatePasswordUseCase'] = mockUpdatePasswordUseCase as any

    const input: UpdatePasswordDto = {
      oldPassword: '123456',
      password: '123456789',
    }

    const result = await sut.updatePassword(id, input)

    expect(output).toMatchObject(result)
    expect(mockUpdatePasswordUseCase.execute).toHaveBeenCalledWith({
      id,
      ...input,
    })
  })

  it('should delete a user', async () => {
    const output: DeleteUserOutput = undefined
    const mockDeleteUserUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }

    sut['deleteUserUseCase'] = mockDeleteUserUseCase as any

    const result = await sut.remove(id)

    expect(output).toStrictEqual(result)
    expect(mockDeleteUserUseCase.execute).toHaveBeenCalledWith({ id })
  })

  it('should find a user', async () => {
    const output: GetUserOutput = props
    const mockGetUserUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }

    sut['getUserUseCase'] = mockGetUserUseCase as any

    const result = await sut.findOne(id)

    expect(output).toStrictEqual(result)
    expect(mockGetUserUseCase.execute).toHaveBeenCalledWith({ id })
  })

  it('should list users', async () => {
    const output: ListUsersOutput = {
      items: [props],
      total: 1,
      currentPage: 1,
      lastPage: 1,
      perPage: 1,
    }
    const mockListUsersUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    }
    const searchParams: ListUsersDto = {
      page: 1,
      perPage: 1,
    }

    sut['listUsersUseCase'] = mockListUsersUseCase as any

    const result = await sut.search(searchParams)

    expect(output).toStrictEqual(result)
    expect(mockListUsersUseCase.execute).toHaveBeenCalledWith(searchParams)
  })
})
