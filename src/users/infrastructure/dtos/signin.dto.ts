import { SignInInput } from '@/users/application/usecases/signin.usecase'

export class SignUpDto implements SignInInput {
  email: string
  password: string
}
