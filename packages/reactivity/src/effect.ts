import { isArray } from '@vue/shared'
import { createDep, Dep } from './dep'

type keyToDepMap = Map<any, Dep>

// 保存依赖的变量
const targetMap = new WeakMap<object, keyToDepMap>()

/** 源码还可以传第二个参数 options?: ReactiveEffectOptions
 */
export function effect<T = any>(fn: () => T) {
  const _effect = new ReactiveEffect(fn)
  // run() 执行 fn(), 如果里面 有响应式数据 则触发 mutableHandle 的 getter 或 setter 行为, 收集或触发依赖
  _effect.run()
}

// 当前被激活的 effect
export let activeEffect: ReactiveEffect | undefined

export class ReactiveEffect<T = any> {
  constructor(public fn: () => T) {}

  run() {
    activeEffect = this
    return this.fn()
  }
}

/** 收集依赖
 */
export function track(target: object, key: unknown) {
  if (!activeEffect) return
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, (dep = createDep()))
  }
  trackEffects(dep)
}

/** 利用 dep 依次跟踪指定 key 的所有 effect
 */
export function trackEffects(dep: Dep) {
  dep.add(activeEffect!)
}

/** 触发依赖
 */
export function trigger(target: object, key: unknown, newValue: unknown) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return
  const dep = depsMap.get(key)
  if (!dep) return
  triggerEffects(dep)
}

/** 依次触发 dep 中保存的依赖
 */
export function triggerEffects(dep: Dep) {
  const effects = isArray(dep) ? dep : [...dep]
  // 依次触发依赖
  for (const effect of effects) {
    triggerEffect(effect)
  }
}

/** 触发指定依赖
 */
export function triggerEffect(effect: ReactiveEffect) {
  effect.run()
}
