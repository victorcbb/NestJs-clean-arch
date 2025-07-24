import { UpdatePasswordInput } from '@/users/application/usecases/updatepassword.usecase'

export class UpdatePasswordDto implements Omit<UpdatePasswordInput, 'id'> {
  password: string
  oldPassword: string
}
