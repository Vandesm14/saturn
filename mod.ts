import { LastPropsStore, runTick } from './src/engine/run.ts';
import { createSystem, System } from './src/engine/system.ts';
import { closurePick, lerp } from './src/utils.ts';

let lastProps: LastPropsStore = new Map();
type State = typeof state;
let state = {
  TICK: 0,
  start: 0,
  end: 500,
  current: 0,
  t: 0,
  activeTimeout: false,
};

const systems: System<State, any>[] = [];
systems.push(
  createSystem<
    State,
    {
      t: State['t'];
      current: State['current'];
      start: State['start'];
      end: State['end'];
    }
  >(
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
  createSystem<
    State,
    {
      t: State['t'];
      current: State['current'];
      end: State['end'];
      activeTimeout: State['activeTimeout'];
      start: State['start'];
    }
  >(
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

setInterval(() => {
  const { state: newState, lastProps: newLastProps } = runTick({
    state,
    systems,
    lastProps,
  });

  state = newState;
  lastProps = newLastProps;
}, 1000 / 30);
