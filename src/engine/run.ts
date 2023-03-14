import { equal } from 'https://deno.land/x/equal@v1.5.0/mod.ts';
import { System } from './system.ts';

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
  const props = system.props(state);
  const isEqual = equal(props, lastProps);
  lastProps = props;

  if (!isEqual) {
    state = { ...state, ...system.fn(structuredClone(state)) };
    console.log(JSON.stringify(state, null, 2));
    state.TICK++;
  }

  return { state, lastProps };
}
