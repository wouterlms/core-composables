/*
  eslint-disable no-use-before-define,
  @typescript-eslint/no-explicit-any
*/
type MaybeAsync<T> = Promise<T> | T

type ValidationOptions = {
  watch?: boolean
}

type Validate<V, F extends Record<keyof F, FormPropertyTypes>> = {
  (value: V, form: FormObject<F>): MaybeAsync<string | boolean | null | undefined>
}

type ValidateWithOptions<V, F extends Record<keyof F, FormPropertyTypes>> = {
  options: ValidationOptions,
  handler: (value: V, FormObject: FormObject<F>) => MaybeAsync<string | boolean | null | undefined>
}

export type FormPropertyTypes = {
  value: any
  returns: any
  set?: any
}

export type GetFormValuesOptions<T> = {
  include?: (keyof T)[]
  exclude?: (keyof T)[]
}

export type GetReturnTypes<T extends { [K in keyof T]: FormPropertyTypes }> = {
  [P in keyof T]: T[P]['returns']
}

export type WithIncludeOrExclude<
  T extends { [K in keyof T]: FormPropertyTypes },
  J,
  K extends GetFormValuesOptions<T>
> =
  K extends { include: (infer U)[] } ?
    U extends keyof T ?
      Pick<GetReturnTypes<T>, U> :
      J
    :
  K extends { exclude: (infer U)[] } ?
    U extends keyof T ?
      Omit<GetReturnTypes<T>, U> :
    J :
  J

export type FormProperty<F, P> = {
  value: P['value']
  error?: string | boolean | null
  validate?: Validate<P['value'], F> | ValidateWithOptions<P['value'], F>

  get?: (value: P['value'], form: FormObject<F>) => P['returns']
  set?: (value: P['set'], form: FormObject<F>) => P['value']
}

export type FormObject<F extends Record<keyof F, FormPropertyTypes>> = {
  [K in keyof F]: FormProperty<F, F[K]>
}

export type Form<T extends Record<keyof T, FormPropertyTypes>> = {
  isValid: Ref<boolean>
  formObject: FormObject<T>
  getFormValues: <K extends GetFormValuesOptions<T>>({
    include,
    exclude,
  }
  ?: K) => WithIncludeOrExclude<T, GetReturnTypes<T>, K>
  setFormValues: (values: {
    [K in keyof T]?: undefined extends T[K]['set'] ? T[K]['value'] : T[K]['set']
  }) => void
  setFormErrors: (errors: Partial<Record<keyof T, string | boolean | null>>) => void
  validate: (input?: keyof T) => void
}
