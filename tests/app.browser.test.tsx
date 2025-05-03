import React from 'react'
import { App } from '../src/App'
import { expect, test } from 'vitest'
import { page } from '@vitest/browser/context'
import { addDays, format } from 'date-fns'

test('should be able to add / update / delete a task', async () => {
  const screen = page.render(<App />)

  await screen.getByRole('button', { name: 'add task' }).click()

  const taskDialog = screen.getByRole('dialog', { name: 'task' })
  await expect.element(taskDialog).toBeVisible()

  const taskDescriptionInput = taskDialog.getByRole('textbox', {
    name: 'task description',
  })
  await taskDescriptionInput.fill('new task')

  const deadlinePickerButton = taskDialog.getByRole('button', {
    name: 'deadline date',
  })
  await deadlinePickerButton.click()

  const calendarPopover = screen.getByRole('dialog', {
    name: 'calendar-popover',
  })
  await expect.element(calendarPopover).toBeVisible()

  const selectableDates = calendarPopover.getByRole('gridcell', {
    disabled: false,
  })
  const firstSelectableDate = selectableDates.first()
  await firstSelectableDate.click()

  await expect.element(calendarPopover).not.toBeInTheDocument()

  await expect(deadlinePickerButton).toHaveTextContent(
    format(new Date(), 'yyyy-MM-dd')
  )

  const doneCheckbox = taskDialog.getByRole('checkbox', {
    name: 'done',
  })
  expect(doneCheckbox).not.toBeChecked()
  expect(doneCheckbox).toBeDisabled()

  await taskDialog.getByRole('button', { name: 'add' }).click()

  await expect.element(taskDialog).not.toBeInTheDocument()

  const searchInput = screen.getByRole('textbox', { name: 'search task' })
  await searchInput.fill('new task')

  await expect
    .poll(() => {
      const tableRows = document.querySelectorAll('tbody > tr')
      return tableRows.length
    })
    .toBe(1)

  let firstRow = document.querySelector('tbody > tr') as HTMLElement
  expect(firstRow).toHaveTextContent(
    [
      'new task',
      format(new Date(), 'yyyy-MM-dd'),
      'Due today',
      'In progress',
    ].join('')
  )

  await firstRow.click()

  await expect.element(taskDialog).toBeVisible()

  expect(taskDescriptionInput).toHaveValue('new task')
  expect(deadlinePickerButton).toHaveTextContent(
    format(new Date(), 'yyyy-MM-dd')
  )
  expect(doneCheckbox).not.toBeChecked()

  await taskDescriptionInput.fill('updated task')

  await deadlinePickerButton.click()
  await expect.element(calendarPopover).toBeVisible()

  const secondSelectableDate = selectableDates.nth(1)
  await secondSelectableDate.click()

  await expect(deadlinePickerButton).toHaveTextContent(
    format(addDays(new Date(), 1), 'yyyy-MM-dd')
  )

  await doneCheckbox.click()
  expect(doneCheckbox).toBeChecked()

  await taskDialog.getByRole('button', { name: 'update' }).click()

  await searchInput.fill('updated task')

  await expect
    .poll(() => {
      const tableRows = document.querySelectorAll('tbody > tr')
      return tableRows.length
    })
    .toBe(1)

  await expect
    .poll(() => document.querySelector('tbody > tr'))
    .toHaveTextContent(
      [
        'updated task',
        format(addDays(new Date(), 1), 'yyyy-MM-dd'),
        'Due in 1 day',
        'Done',
      ].join('')
    )

  firstRow = document.querySelector('tbody > tr') as HTMLElement
  const firstRowCheckbox = firstRow.querySelector(
    'button[role="checkbox"]'
  ) as HTMLButtonElement
  await firstRowCheckbox.click()

  const deleteButton = screen.getByRole('button', {
    name: 'Delete 1 row',
  })
  await expect.element(deleteButton).toBeVisible()
  await deleteButton.click()

  await expect
    .poll(() => document.querySelector('tbody > tr'))
    .toHaveTextContent('No results.')
})

test('should be able to select / unselect all tasks', async () => {
  const screen = page.render(<App />)

  await screen.getByRole('checkbox', { name: 'select all' }).click()

  const rowCheckboxes = screen
    .getByRole('checkbox', {
      name: 'select row',
    })
    .all()

  for (const checkbox of rowCheckboxes) {
    expect(checkbox).toBeChecked()
  }

  await screen.getByRole('checkbox', { name: 'select all' }).click()

  for (const checkbox of rowCheckboxes) {
    expect(checkbox).not.toBeChecked()
  }
})
