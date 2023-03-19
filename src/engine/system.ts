export interface System<S = unknown, P = unknown> {
  name: string;
  props: (state: S) => P;
  fn: (props: P) => void;
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
