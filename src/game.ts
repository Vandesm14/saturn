import { createSystem, System } from './engine/system';
import { lerp } from './utils';

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

export const systems: System<State>[] = [];
systems.push(
  createSystem<State>('updateProgressBar', (state) => {
    const { progressBar } = state;

    progressBar.t += 1 / (30 * 5);
    progressBar.current = lerp(
      progressBar.start,
      progressBar.end,
      progressBar.t
    );

    if (progressBar.t >= 1) {
      progressBar.t = 1;
      progressBar.current = progressBar.end;
    }
  })
);

systems.push(
  createSystem<State>('resetProgressBar', (state) => {
    const { progressBar } = state;

    if (
      progressBar.t === 1 &&
      progressBar.current === progressBar.end &&
      !progressBar.activeTimeout
    ) {
      progressBar.t = 0;
      progressBar.current = progressBar.start;
    }
  })
);
