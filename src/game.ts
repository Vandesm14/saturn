import { createSystem, System } from './engine/system';

type State = typeof state;
export const state = {
  TICK: 0,

  reactor: {
    volts: 0,
    minVolts: 0,
    maxVolts: 1000,

    // Inputs
    on: false,
    start: false,
  },

  power: {
    volts: 0,
    minVolts: 0,
    maxVolts: 500,

    inVolts: [] as number[],
  },

  battery: {
    volts: 0,
    minVolts: 0,
    maxVolts: 20,

    // Inputs
    on: false,
  },
};

export const systems: System<State>[] = [
  createSystem<State>('battery.volts', (state) => {
    const { battery } = state;

    if (battery.on) {
      battery.volts = battery.maxVolts;
    } else {
      battery.volts = battery.minVolts;
    }
  }),

  createSystem<State>('reactor.volts', (state) => {
    const { reactor } = state;

    if (reactor.on) {
      reactor.volts = reactor.maxVolts;
    } else {
      reactor.volts = reactor.minVolts;
    }
  }),

  createSystem<State>('power.inVolts', (state) => {
    const { inVolts } = state.power;
    const { battery, reactor } = state;

    inVolts.length = 0;
    inVolts.push(battery.volts, reactor.volts);
  }),

  createSystem<State>('power.volts', (state) => {
    const { inVolts } = state.power;

    state.power.volts = inVolts.reduce((a, b) => a + b, 0);
  }),
];
