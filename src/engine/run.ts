import { createSystem, System } from './system';
import { produce } from 'immer';

export type LastPropsStore = Map<string, unknown>;
export type CoreState = {
  TICK: number;
};

export type Game<S> = {
  state: S;
  tick: () => void;
};

export function runTick<S extends CoreState>({
  state,
  systems,
}: {
  state: S;
  systems: System<S>[];
}) {
  systems = [
    ...systems,
    createSystem<S>(
      'TICK',
      (s) => s.TICK,
      // @ts-expect-error: FIXME: `t` is unknown because we cannot have `System<S, number>` due to the array of systems being `System<S, unkown>[]`. This is fine for now, but it should be fixed
      (t) => ({ TICK: t + 1 })
    ),
  ];

  return systems.reduce((acc, system) => {
    // Get the data from the acc
    const state = acc;

    // Run the system and extract the new data
    const newState = runSystem<S>({
      state,
      system,
    });

    // Return the new data
    return newState;
  }, state);
}

export function runSystem<S extends CoreState>({
  state,
  system,
}: {
  state: S;
  system: System<S>;
}) {
  return produce(state, (draft) => {
    system.fn(draft as S);
  });
}
