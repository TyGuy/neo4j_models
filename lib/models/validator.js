import neo4j from 'neo4j'
import errors from './errors'

export default class Validator {
  constructor(validation_schema) {
    this.validation_schema = validation_schema
  }

  validate(props, required) {
    let safeProps = {}

    for (let prop in this.validation_schema) {
      let val = props[prop]
      this.validateProp(prop, val, required)
      safeProps[prop] = val
    }

    return safeProps
  }

  // Validates the given property based on the validation info above.
  // By default, ignores null/undefined/empty values, but you can pass `true` for
  // the `required` param to enforce that any required properties are present.
  validateProp(prop, val, required) {
    let info = this.validation_schema[prop]
    let message = info.message

    if (!val) {
      if (info.required && required) {
        throw new errors.ValidationError(
          'Missing ' + prop + ' (required).')
      } else {
        return
      }
    }

    if (info.minLength && val.length < info.minLength) {
      throw new errors.ValidationError(
        'Invalid ' + prop + ' (too short). Requirements: ' + message)
    }

    if (info.maxLength && val.length > info.maxLength) {
      throw new errors.ValidationError(
        'Invalid ' + prop + ' (too long). Requirements: ' + message)
    }

    if (info.pattern && !info.pattern.test(val)) {
      throw new errors.ValidationError(
        'Invalid ' + prop + ' (format). Requirements: ' + message)
    }
  }

  isConstraintViolation(err) {
    return err instanceof neo4j.ClientError &&
      err.neo4j.code === 'Neo.ClientError.Schema.ConstraintViolation'
  }
}
