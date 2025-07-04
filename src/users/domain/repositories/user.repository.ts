import { RepositoryInterface } from '@/shared/domain/repositories/repository-contract'
import { UserEntity } from '../entities/user.entity'

export interface UserRepositoory extends RepositoryInterface<UserEntity> {
  findByEmail(email: string): Promise<UserEntity | null>
  emailExists(email: string): Promise<boolean>
}
