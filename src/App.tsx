import { useState } from 'react'

export function App() {
  const [count, setCount] = useState(0)

  return (
    <main className="app-shell">
      <section className="panel" aria-live="polite">
        <h1>Vite + React + TypeScript</h1>
        <p>Starter project is ready. Edit src/App.tsx to begin.</p>
        <button type="button" onClick={() => setCount((value) => value + 1)}>
          Count: {count}
        </button>
      </section>
    </main>
  )
}
