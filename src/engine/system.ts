export interface System<S = unknown> {
  name: string;
  fn: (state: S) => void;
}

export function createSystem<S = unknown>(
  name: System<S>['name'],
  fn: System<S>['fn']
): System<S> {
  return {
    name,
    fn,
  };
}
