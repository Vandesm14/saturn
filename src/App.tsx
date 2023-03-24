import { createRoot } from 'react-dom/client';
import React from 'react';
import { useGame } from './hooks/useGame';

function App() {
  const { runTick, state, setPath, partial } = useGame();

  React.useEffect(() => {
    setInterval(() => {
      runTick();
    }, 1000 / 30);
  }, []);

  return (
    <>
      <pre>
        <code>{JSON.stringify(state, null, 2)}</code>
      </pre>
      <ul>
        <li>
          <label>
            <input
              type="checkbox"
              checked={state.battery.on}
              onChange={(e) => setPath('battery.on', e.target.checked)}
            />
            Battery
          </label>
        </li>
        <li>
          <label>
            <input
              type="checkbox"
              checked={state.reactor.on}
              onChange={(e) => partial({ reactor: { on: e.target.checked } })}
            />
            Reactor
          </label>
        </li>
        <li>
          <label>
            <input
              type="checkbox"
              checked={state.cpanel.on}
              onChange={(e) => partial({ cpanel: { on: e.target.checked } })}
            />
            Control Panel
          </label>
        </li>
        {state.power.out.cpanel === state.cpanel.minVolts ? (
          <>
            <li>Bus volts: {state.power.supply.total}</li>
            <li>Bus undervolt: {state.power.undervolt ? 'Warn' : ''}</li>
            <li>Batt: {state.battery.on ? 'On' : 'Off'}</li>
            <li>Batt volts: {state.battery.volts}</li>
            <li>Reactor: {state.reactor.on ? 'On' : 'Off'}</li>
            <li>Reactor volts: {state.reactor.volts.value}</li>
          </>
        ) : null}
      </ul>
    </>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
