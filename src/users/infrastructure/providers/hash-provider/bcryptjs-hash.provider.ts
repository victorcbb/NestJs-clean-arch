import { HashProvider } from '@/shared/application/providers/hash-provider'
import { hash, compare } from 'bcryptjs'

export class BcryptJsHashProvider implements HashProvider {
  async generateHash(payload: string): Promise<string> {
    return hash(payload, 6)
  }

  async compareHash(payload: string, hash: string): Promise<boolean> {
    return compare(payload, hash)
  }
}
