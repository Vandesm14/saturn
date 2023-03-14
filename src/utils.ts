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

type DotPrefix<T extends string> = T extends '' ? '' : `.${T}`;
export type NestedKeyof<T> = T extends Record<string, unknown>
  ? {
      [K in Exclude<keyof T, symbol>]: `${K}${DotPrefix<NestedKeyof<T[K]>>}`;
    }[Exclude<keyof T, symbol>]
  : '';

/** A recursive partial to make all properties of an object optional */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartial<U>[]
    : DeepPartial<T[P]>;
};

/** Applies a recursive partial to an object
 * ```ts
 * const source = { prop: 1, nested: { prop: 2 } }
 * const partial = { nested: { another: 3 } }
 *
 * applyPartialDiff(source, partial)
 * // ^ returns { prop: 1, nested: { prop: 2, another: 3 } }
 * ```
 */
export function applyPartialDiff<T extends Record<string, any>>(
  a: T,
  diff: DeepPartial<T>
): T {
  const keys = Object.keys(diff);
  const result: T = { ...a };
  for (const key of keys) {
    if (Array.isArray(a[key])) {
      // ignore
    } else if (typeof a[key] === 'object' && typeof diff[key] === 'object') {
      // @ts-expect-error: yes, string can be used as a key
      result[key] = applyPartialDiff(a[key], diff[key]);
    } else {
      // @ts-expect-error: yes, string can be used as a key
      result[key] = diff[key];
    }
  }
  return result;
}
