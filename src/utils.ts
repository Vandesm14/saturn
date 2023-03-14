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

export type DotPrefix<T extends string> = T extends '' ? '' : `.${T}`;

export type NestedKeyof<T> = T extends Record<string, unknown>
  ? {
      [K in Exclude<keyof T, symbol>]: `${K}${DotPrefix<NestedKeyof<T[K]>>}`;
    }[Exclude<keyof T, symbol>]
  : '';
