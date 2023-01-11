import { isObject } from '@vue/shared'
import { mutableHandlers } from './baseHandlers'

// 源码里头不是 object 类型, 是一个包含 ReactiveFlags 的 Target 接口
const reactiveMap = new WeakMap<object, any>()

export function reactive(target: object) {
  return createReactiveObject(target, mutableHandlers, reactiveMap)
}

export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive'
}

/**
 * 源码有五个参数, 这里省略了第 2 个 isReadonly: boolean 和第四个 collectionHandlers: ProxyHandler<any>
 */
function createReactiveObject(
  target: object,
  baseHandlers: ProxyHandler<any>,
  proxyMap: WeakMap<object, any>
) {
  const existingProxy = proxyMap.get(target)
  if (existingProxy) return existingProxy
  const proxy = new Proxy(target, baseHandlers)
  proxy[ReactiveFlags.IS_REACTIVE] = true
  proxyMap.set(target, proxy)
  return proxy
}

export const toReactive = <T extends unknown>(value: T): T =>
  isObject(value) ? reactive(value as object) : value

export function isReactive(value: unknown): boolean {
  return !!(value && value[ReactiveFlags.IS_REACTIVE])
}
