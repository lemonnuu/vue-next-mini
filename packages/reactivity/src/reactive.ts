import { mutableHandlers } from './baseHandlers'

// 源码里头不是 object 类型, 是一个包含 ReactiveFlags 的 Target 接口
const reactiveMap = new WeakMap<object, any>()

export function reactive(target: object) {
  return createReactiveObject(target, mutableHandlers, reactiveMap)
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
  // target already has corresponding Proxy, target 有相应的 Proxy 直接返回
  if (existingProxy) return existingProxy
  const proxy = new Proxy(target, baseHandlers)
  proxyMap.set(target, proxy)
  return proxy
}
