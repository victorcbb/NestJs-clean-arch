import { validateSync, ValidationError } from 'class-validator'
import {
  FieldsErrors,
  ValidatorFieldsInterface,
} from './validator-fields.interface'

export abstract class ClassValidatorFields<T>
  implements ValidatorFieldsInterface<T>
{
  errors: FieldsErrors = null
  validatedData: T = null

  validate(data: any): boolean {
    const errors: ValidationError[] = validateSync(data)

    if (errors.length) {
      this.errors = {}
      for (const error of errors) {
        const field = error.property
        this.errors[field] = Object.values(
          error.constraints as { [type: string]: string },
        )
      }
    } else {
      this.validatedData = data
    }
    return !errors.length
  }
}
