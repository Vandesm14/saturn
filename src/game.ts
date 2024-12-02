import { nanoid } from 'nanoid';
import { buildWorld, createSystem, IPreptimeWorld, queryComponents } from 'sim-ecs';

type EntityID = string;

class Meta {
  name: string;
  constructor(name: Meta['name']) {
    this.name = name;
  }
}

class Bus {
  id: string;
  list: Set<EntityID>;
  constructor(id: Bus['id'], list: EntityID[]) {
    this.id = id;
    this.list = new Set(list);
  }
}

class Supply {
  value: number;
  constructor(value: Supply['value']) {
    this.value = value;
  }
}

class Demand {
  value: number;
  constructor(value: Demand['value']) {
    this.value = value;
  }
}

class Receives {
  value: number;
  constructor(value: Receives['value']) {
    this.value = value;
  }
}

class OnOff {
  value: number;
  constructor(value: OnOff['value']) {
    this.value = value;
  }
}

const prepWorld = buildWorld()
  .withComponents(Meta, Bus, Supply, Demand, Receives, OnOff)
  .build();

function setup(prepWorld: IPreptimeWorld) {
  const battery = prepWorld
    .buildEntity()
    .with(Meta, 'Battery')
    .with(Supply, 50)
    .with(OnOff, false)
    .build();

  const lightBulb = prepWorld
    .buildEntity()
    .with(Meta, 'Light Bulb')
    .with(Demand, 10)
    .with(Receives, 0)
    .with(OnOff, false)
    .build();

  const toaster = prepWorld
    .buildEntity()
    .with(Meta, 'Toaster')
    .with(Demand, 90)
    .with(Receives, 0)
    .with(OnOff, false)
    .build();

  prepWorld
    .buildEntity()
    .with(Meta, 'Bus')
    .with(Bus, [battery.id, lightBulb.id, toaster.id])
    .with(Supply, 0)
    .with(Demand, 0)
    .build();

  return prepWorld;
}

const busSupplyDemandSystem = createSystem({
  query: queryComponents({
    bus: 
  })
})