import { isArray, isObject, isString } from '.'

export function normalizeClass(value: unknown): string {
  let res = ''

  if (isString(value)) {
    res = value
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const normalized = normalizeClass(value[i])
      res += normalized + ' '
    }
  } else if (isObject(value)) {
    for (const name in value as Object) {
      if ((value as Object)[name]) {
        res += name + ' '
      }
    }
  }

  return res.trim()
}
