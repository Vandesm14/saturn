import { changeDetector, interpolation } from './blocks';
import { createSystem, System } from './engine/system';

type State = typeof state;
export const state = {
  TICK: 0,

  reactor: {
    volts: interpolation.generate(),

    minVolts: 10,
    maxVolts: 1000,

    targetVolts: changeDetector.generate(0),

    // Inputs
    on: false,
  },

  power: {
    // Power supplied to the bus (e.g. battery supplies 20V)
    supply: {
      battery: 0,
      reactor: 0,
      total: 0,
    },
    // Required power drawn from the bus (e.g. control panel requires 10V)
    demand: {
      reactor: 0,
      cpanel: 0,
      total: 0,
    },
    // Actual power drawn from the bus (e.g. control panel only gets 50% -> 5V due to supply/demand)
    out: {
      reactor: 0,
      cpanel: 0,
      total: 0,
    },

    undervolt: false,
  },

  battery: {
    volts: 0,
    minVolts: 0,
    maxVolts: 20,

    // Inputs
    on: false,
  },

  cpanel: {
    minVolts: 40,

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

  createSystem<State>('reactor.targetVolts', (state) => {
    const { reactor, power } = state;

    if (reactor.on && power.out.reactor >= reactor.minVolts) {
      reactor.targetVolts = changeDetector.newValue(
        reactor.targetVolts,
        reactor.maxVolts
      );
    } else {
      reactor.targetVolts = changeDetector.newValue(reactor.targetVolts, 0);
    }
  }),

  createSystem<State>('reactor.volts', (state) => {
    const { reactor } = state;

    if (reactor.targetVolts.didChange) {
      reactor.volts = interpolation.begin(
        reactor.volts,
        reactor.volts.value,
        reactor.targetVolts.value
      );
    } else {
      reactor.volts = interpolation.update(reactor.volts, 1);
    }
  }),

  createSystem<State>('power.supply-and-demand', (state) => {
    const { power, battery, reactor, cpanel } = state;

    power.supply.battery = battery.volts;
    power.supply.reactor = reactor.volts.value;
    power.supply.total = power.supply.battery + power.supply.reactor;

    power.demand.reactor = reactor.on ? reactor.minVolts : 0;
    power.demand.cpanel = cpanel.on ? cpanel.minVolts : 0;
    power.demand.total = power.demand.reactor + power.demand.cpanel;
  }),

  createSystem<State>('power.out', (state) => {
    const { supply, demand, out } = state.power;

    const totalSupply = Object.values(supply).reduce((a, b) => a + b, 0);
    const totalDemand = Object.values(demand).reduce((a, b) => a + b, 0);

    const percent = Math.min(1, totalSupply / totalDemand);

    out.reactor = demand.reactor * percent || 0;
    out.cpanel = demand.cpanel * percent || 0;
    out.total = demand.total * percent || 0;
  }),

  createSystem<State>('power.undervolt', (state) => {
    const { power } = state;

    power.undervolt =
      power.supply.total <= 0 || power.demand.total > power.supply.total;
  }),
];
