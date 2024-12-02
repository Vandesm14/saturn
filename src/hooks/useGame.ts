import { create } from 'zustand';
import {} from '../game';

export interface Game {
  // TODO: type this
  world: any;

  runTick(): void;
}

export const useGame = create<Game>((set, get) => ({
  world: {},

  runTick() {
    // TODO: implement
  },
}));
