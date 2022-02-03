import {
  isReactive,
  ref,
  watch,
} from 'vue'

import {
  Form,
  FormObject,
  FormPropertyTypes,
  GetFormValuesOptions,
  GetReturnTypes,
  WithIncludeOrExclude,
} from '../types/Form'

export default <T extends Record<keyof T, FormPropertyTypes>>(
  formObject: FormObject<T>
): Form<T> => {
  const isValid = ref(false)

  if (!isReactive(formObject)) {
    throw new Error('form object must be reactive')
  }

  const validate = async (input?: keyof T, setError = true) => {
    if (input) {
      const { value, validate } = formObject[input]

      const error = await (typeof validate === 'function'
        ? validate(value, formObject)
        : validate?.handler(value, formObject)
      )

      if (setError) {
        // eslint-disable-next-line no-param-reassign
        formObject[input].error = error
      }

      return
    }

    Object.values(formObject).forEach(async (value) => {
      const formProperty = value as typeof formObject[keyof T]

      if (formProperty.validate) {
        const error = await (
          typeof formProperty.validate === 'function'
            ? formProperty.validate(formProperty.value, formObject)
            : formProperty.validate?.handler(formProperty.value, formObject)
        )

        if (setError) {
          formProperty.error = error
        }
      }
    })
  }

  const getFormValues = <K extends GetFormValuesOptions<T>>({
    include,
    exclude,
  }: K = {} as K): WithIncludeOrExclude<T, GetReturnTypes<T>, K> => {
    if (include && exclude) {
      throw new Error('`include` and `exclude` cannot be used together')
    }

    const propertyValues: Record<string, unknown> = {}

    Object.entries(formObject).forEach(([ key, formProperty ]) => {
      const { value, get } = formProperty as typeof formObject[keyof T]

      if (exclude && exclude.indexOf(key as keyof T) !== -1) {
        return
      }

      if (!include || include.indexOf(key as keyof T) !== -1) {
        if (get) {
          propertyValues[key] = get(value, formObject)
        } else {
          propertyValues[key] = value
        }
      }
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return propertyValues as any
  }

  const setFormValues = (values: {
    [K in keyof T]?: undefined extends T[K]['set'] ? T[K]['value'] : T[K]['set']
  }) => {
    Object.entries(formObject).forEach(([ key, value ]) => {
      const input = key as keyof T
      const formProperty = value as typeof formObject[keyof T]

      if (values[input] === undefined) {
        return
      }

      const { set } = formProperty

      if (set) {
        formProperty.value = set(values[input], formObject)
      } else {
        formProperty.value = values[input] as T[keyof T]['value']
      }
    })
  }

  const setFormErrors = (errors: Partial<Record<keyof T, string | boolean | null>>) => {
    Object.entries(errors).forEach(([ key, error ]) => {
      const formProperty = (formObject as FormObject<T>)[key as keyof T]
      formProperty.error = error as string | boolean | null
    })
  }

  watch(
    formObject, async () => {
      isValid.value = true

      for (let i = 0; i < Object.keys(formObject).length; i += 1) {
        const { value, validate } = Object.values(formObject)[i] as typeof formObject[keyof T]

        // eslint-disable-next-line no-await-in-loop
        const validationResponse = await (
          typeof validate === 'function'
            ? validate(value, formObject)
            : validate?.handler(value, formObject)
        )

        if (typeof validationResponse === 'string'
          || (typeof validationResponse === 'boolean' && !validationResponse)) {
          isValid.value = false
          break
        }
      }
    }, {
      deep: true,
      immediate: true,
    }
  )

  Object.values(formObject).forEach((value) => {
    const formProperty = value as typeof formObject[keyof T]

    if (formProperty.validate) {
      if (typeof formProperty.validate === 'function' || formProperty.validate.options.watch) {
        watch(
          () => formProperty.value,
          async () => {
            if (formProperty.validate) {
              formProperty.error = await (
                typeof formProperty.validate === 'function'
                  ? formProperty.validate(formProperty.value, formObject)
                  : formProperty.validate?.handler(formProperty.value, formObject)
              )
            }
          },
          { deep: true }
        )
      }
    }
  })

  return {
    isValid,
    formObject,
    getFormValues,
    setFormValues,
    setFormErrors,
    validate,
  }
}
