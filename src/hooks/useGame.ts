import { create } from 'zustand';
import { runTick } from '../engine/run';
import { System } from '../engine/system';
import { state as initState, systems } from '../game';

export interface Game<T> {
  state: T;
  systems: System<T>[];

  runTick(): void;
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
}));
