import { equal } from 'https://deno.land/x/equal@v1.5.0/mod.ts';

interface System<P> {
  name: string;
  props: (state: ProgressBarState) => P;
  fn: (props: P) => Partial<ProgressBarState>;
}

function createSystem<P>(
  name: System<P>['name'],
  props: System<P>['props'],
  fn: System<P>['fn']
): System<P> {
  return {
    name,
    props,
    fn,
  };
}

function pick<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: ReadonlyArray<K>
): Pick<T, K> {
  const result: Partial<T> = {};
  for (const key of keys) {
    result[key] = obj[key];
  }
  return result as Pick<T, K>;
}

function closurePick<T extends Record<string, any>, K extends keyof T>(
  keys: ReadonlyArray<K>
): (obj: T) => Pick<T, K> {
  return (obj) => pick(obj, keys);
}

// TODO: better types for an array of systems
const systems: System<any>[] = [];
systems.push(
  createSystem(
    'updateProgressBar',
    closurePick(['t', 'current', 'start', 'end']),
    (state) => {
      state.t += 1 / (30 * 5);
      state.current = lerp(state.start, state.end, state.t);

      if (state.t >= 1) {
        state.t = 1;
        state.current = state.end;
      }

      return state;
    }
  )
);

systems.push(
  createSystem(
    'resetProgressBar',
    closurePick(['t', 'current', 'end', 'activeTimeout', 'start']),
    (state) => {
      if (
        state.t === 1 &&
        state.current === state.end &&
        !state.activeTimeout
      ) {
        state.t = 0;
        state.current = state.start;
      }

      return state;
    }
  )
);

function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

type ProgressBarState = typeof state;
let state = {
  TICK: 0,
  start: 0,
  end: 500,
  current: 0,
  t: 0,
  activeTimeout: false,
};

type LastPropsStore = Map<string, any>;
let lastProps: LastPropsStore = new Map();

function runTick({
  state,
  systems,
  lastProps,
}: {
  state: ProgressBarState;
  systems: System<any>[];
  lastProps: LastPropsStore;
}) {
  return systems.reduce<{
    state: ProgressBarState;
    lastProps: LastPropsStore;
  }>(
    (acc, system) => {
      // Get the data from the acc
      const { state, lastProps } = acc;

      // Get the last props for this system
      const lastPropsForSystem = lastProps.get(system.name) || {};

      // Run the system and extract the new data
      const { state: newState, lastProps: newLastProps } = runSystem({
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

function runSystem({
  state,
  system,
  lastProps,
}: {
  state: ProgressBarState;
  system: System<any>;
  lastProps: Partial<ProgressBarState>;
}) {
  const props = system.props(state);
  const isEqual = equal(props, lastProps);
  lastProps = props;

  if (!isEqual) {
    state = { ...state, ...system.fn(structuredClone(state)) };
    console.log('newState', state);
    state.TICK++;
  }

  return { state, lastProps };
}

setInterval(() => {
  const { state: newState, lastProps: newLastProps } = runTick({
    state,
    systems,
    lastProps,
  });

  state = newState;
  lastProps = newLastProps;
}, 1000 / 30);
