export function pick<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: ReadonlyArray<K>
): Pick<T, K> {
  const result: Partial<T> = {};
  for (const key of keys) {
    result[key] = obj[key];
  }
  return result as Pick<T, K>;
}

export function closurePick<T extends Record<string, any>, K extends keyof T>(
  keys: ReadonlyArray<K>
): (obj: T) => Pick<T, K> {
  return (obj) => pick(obj, keys);
}

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}
