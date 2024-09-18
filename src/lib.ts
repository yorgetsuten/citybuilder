export function random(from: number, to: number) {
  return Math.floor(Math.random() * (to - from + 1) + from)
}

export function clamp(min: number, value: number, max: number) {
  return Math.max(min, Math.min(value, max))
}

export function resize(
  params: { orig: { width: number; height: number } } & (
    | { width: number }
    | { height: number }
  )
) {
  if ('width' in params) {
    return {
      width: params.width,
      height: params.orig.height * (params.width / params.orig.width)
    }
  } else {
    return {
      height: params.height,
      width: (params.orig.width * params.height) / params.orig.height
    }
  }
}

export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  wait: number
): T {
  let time = Date.now()

  return function (this: any, ...args: any[]) {
    if (time + wait - Date.now() < 0) {
      fn.apply(this, args)
      time = Date.now()
    }
  } as T
}
