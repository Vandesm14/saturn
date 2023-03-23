import * as run from './run';
import { createSystem } from './system';
import { System } from './system';

type StateA = {
  TICK: number;
  a: number;
  b: number;
};

function setup(): StateA {
  return {
    TICK: 0,
    a: 1,
    b: 1,
  };
}

describe('run', function () {
  describe('run.runSystem', function () {
    it('should allow incrementing of A', () => {
      let state = setup();

      const system = createSystem<StateA>('increment a', (state) => {
        state.a++;

        return state;
      });

      state = run.runSystem({
        state,
        system: system as System<StateA>,
      });

      expect(state.a).toBe(2);
    });

    it('should allow incrementing of B', () => {
      let state = setup();

      const system = createSystem<StateA>('increment b', (state) => {
        state.b++;

        return state;
      });

      state = run.runSystem({
        state,
        system: system as System<StateA>,
      });

      expect(state.b).toBe(2);
    });
  });

  describe('run.runTick', function () {
    it('should allow incrementing of A', () => {
      let state = setup();

      let system = createSystem<StateA>('increment a', (state) => {
        state.a++;

        return state;
      });

      let tick = run.runTick({
        state,
        systems: [system as System<StateA>],
      });

      state = tick;

      expect(state.a).toBe(2);
    });

    it('should allow incrementing of A and B', () => {
      let state = setup();

      let systemA = createSystem<StateA>('increment a', (state) => {
        state.a++;

        return state;
      });

      let systemB = createSystem<StateA>('increment b', (state) => {
        state.b++;

        return state;
      });

      const tick = run.runTick({
        state,
        systems: [systemA, systemB] as System<StateA>[],
      });

      state = tick;

      expect(state.a).toBe(2);
      expect(state.b).toBe(2);
    });
  });
});
