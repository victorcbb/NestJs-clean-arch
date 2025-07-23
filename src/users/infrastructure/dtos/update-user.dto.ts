import { UpdateUserInput } from '@/users/application/usecases/updateuser.usecase'

export class UpdateUserDto implements Omit<UpdateUserInput, 'id'> {
  name: string
}
