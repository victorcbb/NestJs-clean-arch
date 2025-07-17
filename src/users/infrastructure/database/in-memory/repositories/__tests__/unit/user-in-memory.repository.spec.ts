import { UserEntity } from '@/users/domain/entities/user.entity'
import { UserInMemoryRepository } from '../../user-in-memory.repository'
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder'
describe('UserInMemoryRepository Unit Tests', () => {
  let sut: UserInMemoryRepository

  beforeEach(() => {
    sut = new UserInMemoryRepository()
  })

  it('Should return null when not found an user by email', async () => {
    const user = await sut.findByEmail('test@email.com')

    expect(user).toBeNull()
  })

  it('Should find an user by email', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    await sut.insert(entity)
    const user = await sut.findByEmail(entity.email)

    expect(entity.toJSON()).toStrictEqual(user.toJSON())
  })

  it('Should return false when an email not exists', async () => {
    const user = await sut.emailExists('test@email.com')

    expect(user).toBeFalsy()
  })

  it('Should return true when an email exists', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    await sut.insert(entity)
    const emailExists = await sut.emailExists(entity.email)

    expect(emailExists).toBeTruthy()
  })

  it('Should not filter items when filter object is null', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    await sut.insert(entity)

    const items = await sut.findAll()
    const filterSpy = jest.spyOn(items, 'filter')
    const itemsFiltered = await sut['applyFilter'](items, null)

    expect(filterSpy).not.toHaveBeenCalled()
    expect(items).toStrictEqual(itemsFiltered)
  })

  it('Should filter items when using filter params', async () => {
    const items = [
      new UserEntity(
        UserDataBuilder({ name: 'Test', email: 'test@email.com' }),
      ),
      new UserEntity(
        UserDataBuilder({ name: 'TEST', email: 'test2@email.com' }),
      ),
      new UserEntity(
        UserDataBuilder({ name: 'fake', email: 'fake@email.com' }),
      ),
    ]

    const filterSpy = jest.spyOn(items, 'filter')
    let itemsFiltered = await sut['applyFilter'](items, { name: 'TEST' })

    expect(filterSpy).toHaveBeenCalledTimes(1)
    expect(itemsFiltered).toStrictEqual([items[0], items[1]])

    itemsFiltered = await sut['applyFilter'](items, {
      email: 'test2@email.com',
    })

    expect(filterSpy).toHaveBeenCalledTimes(2)
    expect(itemsFiltered).toStrictEqual([items[1]])

    itemsFiltered = await sut['applyFilter'](items, {
      name: 'TEST',
      email: 'test2@email.com',
    })

    expect(filterSpy).toHaveBeenCalledTimes(3)
    expect(itemsFiltered).toStrictEqual([items[1]])
  })

  it('Should sort by createdAt when sort param is null', async () => {
    const createdAt = new Date()

    const items = [
      new UserEntity(UserDataBuilder({ name: 'Test', createdAt })),
      new UserEntity(
        UserDataBuilder({
          name: 'TEST',
          createdAt: new Date(createdAt.getTime() + 1),
        }),
      ),
      new UserEntity(
        UserDataBuilder({
          name: 'fake',
          createdAt: new Date(createdAt.getTime() + 2),
        }),
      ),
    ]

    const itemsSorted = await sut['applySort'](items, null, null)

    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]])
  })

  it('Should sort by name', async () => {
    const items = [
      new UserEntity(UserDataBuilder({ name: 'C' })),
      new UserEntity(UserDataBuilder({ name: 'a' })),
      new UserEntity(UserDataBuilder({ name: 'B' })),
    ]

    let itemsSorted = await sut['applySort'](items, 'name', 'asc')

    expect(itemsSorted).toStrictEqual([items[1], items[2], items[0]])

    itemsSorted = await sut['applySort'](items, 'name', null)

    expect(itemsSorted).toStrictEqual([items[0], items[2], items[1]])
  })
})
