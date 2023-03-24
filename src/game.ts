import { changeDetector, interpolation } from './blocks';
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
    volts: interpolation.generate(),
    minVolts: 10,
    maxVolts: 500,

    inVolts: [] as number[],
    voltsDidChange: changeDetector.generate(0),
    undervolt: false,
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
      battery.volts = 0;
    }
  }),

  createSystem<State>('reactor.volts', (state) => {
    const { reactor } = state;

    if (reactor.on) {
      reactor.volts = reactor.maxVolts;
    } else {
      reactor.volts = 0;
    }
  }),

  createSystem<State>('power.inVolts', (state) => {
    const { inVolts } = state.power;
    const { battery, reactor } = state;

    inVolts.length = 0;
    inVolts.push(battery.volts, reactor.volts);
  }),

  createSystem<State>('power.volts', (state) => {
    const { inVolts, volts } = state.power;

    const newVolts = inVolts.reduce((a, b) => a + b, 0);

    state.power.voltsDidChange = changeDetector.detect(
      state.power.voltsDidChange,
      newVolts
    );

    if (state.power.voltsDidChange.didChange) {
      state.power.volts = interpolation.begin(volts, volts.value, newVolts);
    } else {
      state.power.volts = interpolation.update(volts, 1);
    }
  }),

  createSystem<State>('power.undervolt', (state) => {
    const { power } = state;

    power.undervolt = power.volts.value < power.minVolts;
  }),
];
