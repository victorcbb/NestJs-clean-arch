import { BcryptJsHashProvider } from '@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider'

describe('BcryptJsHashProvider unit test', () => {
  let sut: BcryptJsHashProvider

  beforeEach(() => {
    sut = new BcryptJsHashProvider()
  })

  it('should return a hash when a text is provided', async () => {
    const text = 'any_string'
    const hash = await sut.generateHash(text)

    expect(hash).toBeDefined()
  })

  it('should return false on invalid password and hash comparison', async () => {
    const text = 'any_string'
    const hash = await sut.generateHash(text)

    const isValid = await sut.compareHash('invalid_password', hash)

    expect(isValid).toBeFalsy()
  })

  it('should return true on valid password and hash comparison', async () => {
    const text = 'any_string'
    const hash = await sut.generateHash(text)

    const isValid = await sut.compareHash(text, hash)

    expect(isValid).toBeTruthy()
  })
})
