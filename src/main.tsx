import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.tsx'
import './index.css'

import { worker } from './mocks/browser.ts'
import { setToDos } from './mocks/handlers.ts'
import { ToDo } from './types/api.ts'
import { AI_GENERATED_TODO_TITLES } from './lib/const.ts'

const INITIAL_TODOS: ToDo[] = []
for (let i = 0; i < AI_GENERATED_TODO_TITLES.length; i++) {
  INITIAL_TODOS.push({
    id: i,
    text: AI_GENERATED_TODO_TITLES[i],
    deadline:
      Math.random() > 0.3
        ? Date.now() + 86400000 * (i % 50)
        : Date.now() - 86400000 * (i % 5),
    done: Math.random() > 0.5,
  })
}

setToDos(INITIAL_TODOS)

worker.start()

const root = ReactDOM.createRoot(document.getElementById('root')!)

worker
  .start({
    quiet: true,
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
  })
  .then(() => {
    return root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
  })
