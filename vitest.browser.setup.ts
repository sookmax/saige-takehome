import 'vitest-browser-react'
import './src/index.css'
import { worker } from './src/mocks/browser'

await worker.start({ quiet: true, onUnhandledRequest: 'bypass' })
