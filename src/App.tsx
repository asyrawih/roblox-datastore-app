import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/electron-vite.animate.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-50">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 p-10">
        <div className="flex items-center gap-6">
          <a href="https://electron-vite.github.io" target="_blank" rel="noreferrer">
            <img src={viteLogo} className="h-16 w-16" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank" rel="noreferrer">
            <img src={reactLogo} className="h-16 w-16" alt="React logo" />
          </a>
        </div>

        <h1 className="text-3xl font-semibold tracking-tight">
          Electron + Vite + React + Tailwind
        </h1>

        <div className="flex items-center gap-3">
          <button
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
            onClick={() => setCount((c) => c + 1)}
          >
            Count: {count}
          </button>
          <button
            className="rounded-md border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-900"
            onClick={() => setCount(0)}
          >
            Reset
          </button>
        </div>

        <p className="text-sm text-zinc-400">
          Edit <code className="rounded bg-zinc-900 px-1 py-0.5">src/App.tsx</code> and save to test HMR.
        </p>
      </div>
    </div>
  )
}

export default App
