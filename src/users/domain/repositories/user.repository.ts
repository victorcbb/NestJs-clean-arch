import { UserEntity } from '../entities/user.entity'
import { SearchableRepositoryInterface } from '@/shared/domain/repositories/searchable-repository-contract'

export interface UserRepositoory
  extends SearchableRepositoryInterface<UserEntity, any, any> {
  findByEmail(email: string): Promise<UserEntity | null>
  emailExists(email: string): Promise<boolean>
}
