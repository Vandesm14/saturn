import equal from 'fast-deep-equal';
import { createSystem, System } from './system';
import produce from 'immer';

export type LastPropsStore = Map<string, unknown>;
export type CoreState = {
  TICK: number;
};

export function runTick<S extends CoreState>({
  state,
  systems,
  lastProps,
}: {
  state: S;
  systems: System<S>[];
  lastProps: LastPropsStore;
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

  return systems.reduce<{
    state: S;
    lastProps: LastPropsStore;
  }>(
    (acc, system) => {
      // Get the data from the acc
      const { state, lastProps } = acc;

      // Get the last props for this system
      const lastPropsForSystem = lastProps.get(system.name) || {};

      // Run the system and extract the new data
      const { state: newState, lastProps: newLastProps } = runSystem<S>({
        state,
        system,
        lastProps: lastPropsForSystem,
      });

      // Set the new last props for this system
      lastProps.set(system.name, newLastProps);

      // Return the new data
      return { state: newState, lastProps };
    },
    { state, lastProps }
  );
}

export function runSystem<S extends CoreState>({
  state,
  system,
  lastProps,
}: {
  state: S;
  system: System<S>;
  lastProps: unknown;
}) {
  const newState = produce(state, (draft) => {
    // @ts-expect-error: FIXME: Not sure how to fix this, Draft is a different type than State
    const props = system.props(draft);
    const isEqual = equal(props, lastProps);
    lastProps = structuredClone(props);

    if (!isEqual) {
      // Function mutates the draft
      system.fn(props);
    }

    return draft;
  });

  return { state: newState, lastProps };
}
