import { InMemoryRepository } from '@/shared/domain/repositories/in-memory.repository'
import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserRepositoory } from '@/users/domain/repositories/user.repository'

export class UserInMemoryRepository
  extends InMemoryRepository<UserEntity>
  implements UserRepositoory
{
  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.item.find(user => user.email === email)
  }
  async emailExists(email: string): Promise<boolean> {
    return this.item.some(user => user.email === email)
  }
}
