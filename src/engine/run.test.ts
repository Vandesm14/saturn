import * as run from './run';
import { all, createSystem } from './system';
import { System } from './system';

type StateA = {
  TICK: number;
  a: number;
  b: number;
};

function setup(): { state: StateA; lastProps: run.LastPropsStore } {
  const lastProps = new Map();

  const state = {
    TICK: 0,
    a: 1,
    b: 1,
  };

  return { state, lastProps };
}

describe('run', function () {
  describe('run.runSystem', function () {
    it('should allow incrementing of A', () => {
      const { state, lastProps } = setup();

      const system = createSystem<StateA, StateA>(
        'increment a',
        all,
        (state) => {
          state.a++;

          return state;
        }
      );

      run.runSystem({
        state,
        system: system as System<StateA, unknown>,
        lastProps,
      });

      expect(state.a).toBe(2);
    });

    it('should allow incrementing of B', () => {
      const { state, lastProps } = setup();

      const system = createSystem<StateA, StateA>(
        'increment b',
        all,
        (state) => {
          state.b++;

          return state;
        }
      );

      run.runSystem({
        state,
        system: system as System<StateA, unknown>,
        lastProps,
      });

      expect(state.b).toBe(2);
    });
  });

  describe('run.runTick', function () {
    it('should allow incrementing of A', () => {
      let { state, lastProps } = setup();

      let system = createSystem<StateA, StateA>('increment a', all, (state) => {
        state.a++;

        return state;
      });

      let tick = run.runTick({
        state,
        systems: [system as System<StateA, unknown>],
        lastProps,
      });

      state = tick.state;
      lastProps = tick.lastProps;

      expect(state.a).toBe(2);
    });

    it('should allow incrementing of A and B', () => {
      let { state, lastProps } = setup();

      let systemA = createSystem<StateA, StateA>(
        'increment a',
        all,
        (state) => {
          state.a++;

          return state;
        }
      );

      let systemB = createSystem<StateA, StateA>(
        'increment b',
        all,
        (state) => {
          state.b++;

          return state;
        }
      );

      const tick = run.runTick({
        state,
        systems: [systemA, systemB] as System<StateA, unknown>[],
        lastProps,
      });

      state = tick.state;
      lastProps = tick.lastProps;

      expect(state.a).toBe(2);
      expect(state.b).toBe(2);
    });
  });

  describe('run.game', function () {
    it('should allow incrementing of A', () => {
      const { state } = setup();

      const system = createSystem<StateA, StateA>(
        'increment a',
        all,
        (state) => {
          state.a++;

          return state;
        }
      );

      const game = run.game({
        systems: [system as System<StateA, unknown>],
        state,
      });

      game.tick();

      expect(game.state.a).toBe(2);
    });

    it('should allow incrementing of A and B', () => {
      const { state } = setup();

      const systemA = createSystem<StateA, StateA>(
        'increment a',
        all,
        (state) => {
          state.a++;

          return state;
        }
      );

      const systemB = createSystem<StateA, StateA>(
        'increment b',
        all,
        (state) => {
          state.b++;

          return state;
        }
      );

      const game = run.game({
        systems: [systemA, systemB] as System<StateA, unknown>[],
        state,
      });

      game.tick();

      expect(game.state.a).toBe(2);
      expect(game.state.b).toBe(2);
    });
  });
});
