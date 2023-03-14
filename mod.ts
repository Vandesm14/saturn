import { equal } from 'https://deno.land/x/equal@v1.5.0/mod.ts';

type SystemProps = Partial<ProgressBarState>;
interface System<P extends SystemProps> {
  name: string;
  props: P;
  fn: (props: Extract<ProgressBarState, P>) => ProgressBarState;
}

function createSystem<P extends SystemProps>(
  name: string,
  props: System<P>['props'],
  fn: System<P>['fn']
): System<P> {
  return {
    name,
    props,
    fn,
  };
}

const updateProgressBar = createSystem(
  'updateProgressBar',
  {
    t: 1,
    current: 1,
    start: 1,
    end: 1,
  },
  (state) => {
    state.t += 0.005;
    state.current = lerp(state.start, state.end, state.t);

    if (state.t >= 1) {
      state.t = 1;
      state.current = state.end;
    }

    return state;
  }
);

function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

type ProgressBarState = typeof state;
let state = {
  TICK: 0,
  start: 0,
  end: 100,
  current: 0,
  t: 0,
};

function entries<T extends object>(obj: T): [keyof T, any][] {
  return Object.entries(obj) as any;
}

let lastProps: Partial<ProgressBarState> = {};
let activeTimeout = false;

setInterval(() => {
  const props = entries(structuredClone(state)).reduce<
    Partial<ProgressBarState>
  >((acc, [key, value]) => {
    if (Object.hasOwn(updateProgressBar.props, key))
      return { ...acc, [key]: value };
    else return acc;
  }, {});

  // console.log(`start of tick: ${state.TICK}`, {
  //   props,
  //   lastProps,
  // });

  const isEqual = equal(props, lastProps);
  lastProps = props;

  if (!isEqual) {
    state = structuredClone(updateProgressBar.fn(structuredClone(state)));
    console.log('newState', state);
    state.TICK++;
  } else if (state.t === 1 && state.current === state.end && !activeTimeout) {
    console.log('resetting');
    activeTimeout = true;
    setTimeout(() => {
      state.t = 0;
      activeTimeout = false;
    }, 1000);
  }
}, 1000 / 60);
