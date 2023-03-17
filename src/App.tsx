import { createRoot } from 'react-dom/client';
import React from 'react';
import { useGame } from './hooks/useGame';
import { shallow } from 'zustand/shallow';

function App() {
  const { runTick, state } = useGame();

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
      <div
        style={{
          width: `${state.progressBar.end}px`,
          height: '20px',
          backgroundColor: 'black',
        }}
      >
        <div
          style={{
            width: `${state.progressBar.current}px`,
            height: '20px',
            backgroundColor: 'red',
          }}
        ></div>
      </div>
      <h2
        style={{
          position: 'absolute',
          left: `${state.progressBar.current - 20}px`,
        }}
      >
        {(state.progressBar.current / 100).toFixed(1)}
      </h2>
    </>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
