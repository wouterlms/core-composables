/* eslint-disable @typescript-eslint/no-explicit-any */
import baseRules from './rules'
import defaultMessages from './messages'

type Rules = {
  required?: boolean
  email?: boolean
  url?: boolean
  minLength?: number | false
  maxLength?: number | false
  fileSize?: number | false
  min?: number | Date | false
  max?: number | Date | false
}

type MaybeAsync<T> = T | Promise<T>

// eslint-disable-next-line @typescript-eslint/ban-types
type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any ? A : never;

type CustomRule = {
  [key: string]: (value: any, ruleOptions: any) => MaybeAsync<boolean>
}

type CustomRules<R extends {
  [key: string]: (value: any, ruleOptions: any) => MaybeAsync<boolean>
}> = {
  [K in keyof R]: ArgumentTypes<R[K]>[1] extends undefined ? boolean : ArgumentTypes<R[K]>[1]
}

type CustomMessages<R> = {
  [K in keyof R]: string | ((value: any, options: any) => string)
}

type CustomizeDefaultMessages ={
  [K in keyof Rules]: string | ((value: any, options: any) => string)
}

export default <R extends CustomRule>(options: {
  rules?: R,
  messages?: CustomMessages<R> | CustomizeDefaultMessages
} = {}) => {
  const { rules: customRules, messages: customMessages } = options

  const allRules = {
    ...baseRules,
    ...customRules,
  }

  const allMessages: Record<string, string | ((value: any, options: any) => string)> = {
    ...defaultMessages(),
    ...customMessages,
  }

  const applyRules = async (
    value: any, rules: Rules | Partial<CustomRules<R>>,
    customRuleMessages?: CustomMessages<R> | CustomizeDefaultMessages
  ) => {
    for (let i = 0; i < Object.keys(rules).length; i += 1) {
      const [ rule, ruleOptions ] = Object.entries((rules))[i]

      if (ruleOptions === false) {
        break
      }

      const ruleFn = allRules[rule as keyof Rules]

      // eslint-disable-next-line no-await-in-loop
      const isValid = await ruleFn(value, ruleOptions as any)

      if (!isValid) {
        const message = customRuleMessages?.[
          rule as keyof (CustomMessages<R> | CustomizeDefaultMessages)
        ] || allMessages[rule]

        if (!message) {
          return `${rule} error`
        }

        if (typeof message === 'string') {
          return message
        }

        return message(value, ruleOptions)
      }
    }

    return null
  }

  return {
    applyRules,
  }
}
