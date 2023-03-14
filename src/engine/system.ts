export interface System<S = unknown, P = unknown> {
  name: string;
  props: (state: S) => P;
  fn: (props: P) => Partial<S>;
}

export function createSystem<S = unknown, P = unknown>(
  name: System<S, P>['name'],
  props: System<S, P>['props'],
  fn: System<S, P>['fn']
): System<S, P> {
  return {
    name,
    props,
    fn,
  };
}

const testState = {
  a: 1,
  b: 2,
  result: 0,
  some: {
    nested: {
      property: 1,
    },
  },
};
type TestState = typeof testState;
