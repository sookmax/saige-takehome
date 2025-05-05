import React from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'
import './index.css'

import { worker } from './mocks/browser.ts'
import { INITIAL_TODOS } from './lib/const.ts'
import { setToDos } from './mocks/handlers.ts'

if (import.meta.env.VITE_INITIAL_DATA === 'true') {
  setToDos(INITIAL_TODOS)
} else {
  setToDos([])
}

worker
  .start({
    quiet: true,
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
  })
  .then(() => {
    const root = createRoot(document.getElementById('root')!)
    return root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
  })
