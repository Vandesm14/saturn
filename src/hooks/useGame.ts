import { create } from 'zustand';
import { runTick } from '../engine/run';
import { System } from '../engine/system';
import { state as initState, systems } from '../game';

export interface Game<T> {
  state: T;
  lastProps: Map<string, unknown>;
  systems: System<T>[];

  runTick(): void;
}

export const useGame = create<Game<typeof initState>>((set, get) => ({
  state: initState,
  lastProps: new Map(),
  systems,

  runTick() {
    const { state: newState, lastProps: newLastProps } = runTick({
      state: get().state,
      systems: get().systems,
      lastProps: get().lastProps,
    });

    set({
      state: newState,
      lastProps: newLastProps,
    });
  },
}));
