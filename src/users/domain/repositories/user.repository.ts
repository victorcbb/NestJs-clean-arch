import { UserEntity } from '../entities/user.entity'
import {
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResult,
  SearchableRepositoryInterface,
} from '@/shared/domain/repositories/searchable-repository-contract'

export type UserFilter = { name?: string; email?: string }

export class SearchParams extends DefaultSearchParams<UserFilter> {}
export class SearchResult extends DefaultSearchResult<UserEntity, UserFilter> {}

export interface UserRepositoory
  extends SearchableRepositoryInterface<
    UserEntity,
    UserFilter,
    SearchParams,
    SearchResult
  > {
  findByEmail(email: string): Promise<UserEntity | null>
  emailExists(email: string): Promise<boolean>
}
