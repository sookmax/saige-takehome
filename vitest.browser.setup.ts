// import 'vitest-browser-react'
import './src/index.css'
import { worker } from './src/mocks/browser'
import { setToDos } from './src/mocks/handlers'
import { INITIAL_TODOS } from './src/lib/const'

setToDos(INITIAL_TODOS)

await worker.start({ quiet: true, onUnhandledRequest: 'bypass' })
