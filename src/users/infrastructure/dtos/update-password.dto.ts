import { UpdatePasswordInput } from '@/users/application/usecases/updatepassword.usecase'

export class UpdatePasswordDto implements Omit<UpdatePasswordInput, 'id'> {
  id: string
  password: string
  oldPassword: string
}
