import { createSystem, System } from './engine/system';
import { lerp, pick } from './utils';

type State = typeof state;
export const state = {
  TICK: 0,
  progressBar: {
    start: 0,
    end: 500,
    current: 0,
    t: 0,
    activeTimeout: false,
  },
};

export const systems: System<State, any>[] = [];
systems.push(
  createSystem<
    State,
    Pick<State['progressBar'], 't' | 'current' | 'start' | 'end'>
  >(
    'updateProgressBar',
    (state) => pick(state.progressBar, ['t', 'current', 'start', 'end']),
    (state) => {
      state.t += 1 / (30 * 5);
      state.current = lerp(state.start, state.end, state.t);

      if (state.t >= 1) {
        state.t = 1;
        state.current = state.end;
      }

      return { progressBar: state };
    }
  )
);

systems.push(
  createSystem<
    State,
    Pick<
      State['progressBar'],
      't' | 'current' | 'end' | 'activeTimeout' | 'start'
    >
  >(
    'resetProgressBar',
    (state) =>
      pick(state.progressBar, [
        't',
        'current',
        'end',
        'activeTimeout',
        'start',
      ]),
    (state) => {
      if (
        state.t === 1 &&
        state.current === state.end &&
        !state.activeTimeout
      ) {
        state.t = 0;
        state.current = state.start;
      }

      return { progressBar: state };
    }
  )
);
