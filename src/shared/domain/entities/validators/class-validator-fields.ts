import { validateSync, ValidationError } from 'class-validator'
import {
  FieldsErrors,
  ValidatorFieldsInterface,
} from './validator-fields.interface'

export abstract class ClassValidatorFields<T>
  implements ValidatorFieldsInterface<T>
{
  errors: FieldsErrors = {}
  validatedData!: T

  validate(data: T): boolean {
    if (typeof data !== 'object' || data === null) {
      throw new Error('Validation requires a valid class instance')
    }

    const errors: ValidationError[] = validateSync(data)

    if (errors.length) {
      this.errors = {}
      for (const error of errors) {
        const field = error.property
        this.errors[field] = Object.values(
          error.constraints as { [type: string]: string },
        )
      }

      return false
    } else {
      this.validatedData = data
      return true
    }
  }
}
