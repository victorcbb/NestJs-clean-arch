import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  HttpCode,
  HttpStatus,
  Query,
  Put,
} from '@nestjs/common'
import { SignUpDto } from './dtos/signup.dto'
import { UpdateUserDto } from './dtos/update-user.dto'
import { SignUpUseCase } from '../application/usecases/signup.usecase'
import { SignInUseCase } from '../application/usecases/signin.usecase'
import { ListUsersUseCase } from '../application/usecases/listusers.usecase'
import { GetUserUseCase } from '../application/usecases/getuser.usecase'
import { UpdateUserUseCase } from '../application/usecases/updateuser.usecase'
import { UpdatePasswordUseCase } from '../application/usecases/updatepassword.usecase'
import { DeleteUserUseCase } from '../application/usecases/deleteuser.usecase'
import { SignInDto } from './dtos/signin.dto'
import { ListUsersDto } from './dtos/list-users.dto'
import { UpdatePasswordDto } from './dtos/update-password.dto'

@Controller('users')
export class UsersController {
  @Inject(SignUpUseCase)
  private signUpUsecase: SignUpUseCase

  @Inject(SignInUseCase)
  private signInUsecase: SignInUseCase

  @Inject(ListUsersUseCase)
  private listUsersUsecase: ListUsersUseCase

  @Inject(GetUserUseCase)
  private getUserUsecase: GetUserUseCase

  @Inject(UpdateUserUseCase)
  private updateUserUsecase: UpdateUserUseCase

  @Inject(UpdatePasswordUseCase)
  private updatePasswordUsecase: UpdatePasswordUseCase

  @Inject(DeleteUserUseCase)
  private deleteUserUsecase: DeleteUserUseCase

  @Post()
  async create(@Body() signUpDto: SignUpDto) {
    return await this.signUpUsecase.execute(signUpDto)
  }

  @HttpCode(HttpStatus.OK) // 200
  @Post('/login')
  async login(@Body() signInDto: SignInDto) {
    return await this.signInUsecase.execute(signInDto)
  }

  @Get()
  async search(@Query() searchParams: ListUsersDto) {
    return await this.listUsersUsecase.execute(searchParams)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.getUserUsecase.execute({ id })
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.updateUserUsecase.execute({ id, ...updateUserDto })
  }

  @Patch(':id')
  async updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return await this.updatePasswordUsecase.execute({
      id,
      ...updatePasswordDto,
    })
  }

  @HttpCode(HttpStatus.NO_CONTENT) // 204
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.deleteUserUsecase.execute({ id })
  }
}
