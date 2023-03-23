import { create } from 'zustand';
import { runTick } from '../engine/run';
import { System } from '../engine/system';
import { state as initState, systems } from '../game';
import { applyPartialDiff, DeepPartial } from '../utils';

export interface Game<T> {
  state: T;
  systems: System<T>[];

  runTick(): void;

  /** `setPath('state.nested.value', 1234) */
  setPath(path: string, value: any): void;

  partial(partial: DeepPartial<T>): void;
}

export const useGame = create<Game<typeof initState>>((set, get) => ({
  state: initState,
  lastProps: new Map(),
  systems,

  runTick() {
    const newState = runTick({
      state: get().state,
      systems: get().systems,
    });

    set({
      state: newState,
    });
  },

  setPath(path: string, value: any) {
    const state = structuredClone(get().state);
    const parts = path.split('.');
    const last = parts.pop()!;

    let current = state;
    for (const part of parts) {
      current = current[part];
    }

    current[last] = value;

    console.log('newState', state);

    set({
      state,
    });
  },

  partial(partial) {
    const state = get().state;

    set({ state: applyPartialDiff(state, partial) });
  },
}));
