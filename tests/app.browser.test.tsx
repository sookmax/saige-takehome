import React from 'react'
import { App } from '../src/App'
import { expect, test } from 'vitest'
import { page } from '@vitest/browser/context'

test('add task button should open new task dialog when clicked', async () => {
  const screen = page.render(<App />)

  await screen.getByRole('button', { name: 'add task' }).click()

  await expect
    .element(screen.getByRole('dialog', { name: 'task' }))
    .toBeVisible()
})
