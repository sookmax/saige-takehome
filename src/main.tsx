import React from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'
import './index.css'

import { worker } from './mocks/browser.ts'

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
