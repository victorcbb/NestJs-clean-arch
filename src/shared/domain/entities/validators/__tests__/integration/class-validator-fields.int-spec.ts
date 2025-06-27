import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator'
import { ClassValidatorFields } from '../../class-validator-fields'

class StubRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string

  @IsNumber()
  @IsNotEmpty()
  price: number

  constructor(data: any) {
    Object.assign(this, data)
  }
}

class StubClassValidatorFields extends ClassValidatorFields<StubRules> {
  validate(data: any): boolean {
    const rules = new StubRules(data)

    return super.validate(rules)
  }
}

describe('ClassValidatorFields integration tests', () => {
  let validator: StubClassValidatorFields
  beforeEach(() => {
    validator = new StubClassValidatorFields()
  })

  it('Should validate with errors', () => {
    expect(validator.validate(null)).toBeFalsy()
    expect(validator.errors).toStrictEqual({
      name: [
        'name should not be empty',
        'name must be a string',
        'name must be shorter than or equal to 255 characters',
      ],
      price: [
        'price should not be empty',
        'price must be a number conforming to the specified constraints',
      ],
    })
  })

  it('Should validate without errors', () => {
    expect(validator.validate({ name: 'string', price: 10 })).toBeTruthy()
    expect(validator.validatedData).toStrictEqual(
      new StubRules({ name: 'string', price: 10 }),
    )
    expect(validator.errors).toBeNull()
  })
})
