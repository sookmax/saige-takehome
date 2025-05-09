import 'vitest-browser-react' // brought this import here from setup file to make typescript happy 🤷‍♂️
import React from 'react'
import { App } from '../src/App'
import { describe, expect, test } from 'vitest'
import { page } from '@vitest/browser/context'
import { addDays, differenceInDays, format } from 'date-fns'
import { TODAY_MIDNIGHT } from '../src/lib/const'

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

describe('search input', () => {
  test('should be able to search tasks and the search keyword should persist in the url', async () => {
    const screen = page.render(<App />)

    const searchInput = screen.getByRole('textbox', { name: 'search tasks' })
    await searchInput.fill('favicon')

    await expect
      .poll(() => {
        const textCells = screen.getByRole('cell', { name: 'text' }).elements()
        return textCells.every((cell) => cell.textContent?.includes('favicon'))
      })
      .toBe(true)

    const url = new URL(window.location.href)
    expect(url.searchParams.get('q')).toBe('favicon')
  })

  // turns out it's really hard to manipulate the `Location` object in vitest browser mode
  // relevant issue: https://github.com/vitest-dev/vitest/issues/7424
  test.skip('should be able to grab the search keyword from the url as initial value', async () => {
    const url = new URL(window.location.href)
    url.searchParams.set('q', 'favicon')
    expect(url.searchParams.get('q')).toBe('favicon') // even if this passes, the rendered app will not have the search param `q`

    const screen = page.render(<App />)
    const searchInput = screen.getByRole('textbox', { name: 'search tasks' })
    expect(searchInput).toHaveValue('favicon')

    await expect
      .poll(() => {
        const textCells = screen.getByRole('cell', { name: 'text' }).elements()
        return textCells.every((cell) => cell.textContent?.includes('favicon'))
      })
      .toBe(true)
  })
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

describe('table filters', () => {
  describe('due date filter', () => {
    test('should be able to filter tasks by overdue', async () => {
      const screen = page.render(<App />)

      await screen.getByRole('checkbox', { name: 'overdue' }).click()

      await expect
        .poll(() => {
          const timeLeftCellTexts = screen
            .getByRole('cell', { name: 'time-left' })
            .elements()
            .map((el) => el.textContent)
          const statusCellTexts = screen
            .getByRole('cell', { name: 'done' })
            .elements()
            .map((el) => el.textContent)

          const results: boolean[] = []
          for (let i = 0; i < timeLeftCellTexts.length; i++) {
            results.push(
              ['Completed-Done', 'Overdue-In progress'].includes(
                `${timeLeftCellTexts[i]}-${statusCellTexts[i]}`
              )
            )
          }
          return results.every((result) => result)
        })
        .toBe(true)
    })

    test('should be able to filter tasks by due in 3 days', async () => {
      const screen = page.render(<App />)

      await screen.getByRole('checkbox', { name: 'in 3 days' }).click()

      await expect
        .poll(() => {
          const deadlineCellDates = screen
            .getByRole('cell', { name: 'deadline' })
            .elements()
            .map((el) => new Date(el.textContent!))

          return deadlineCellDates.every(
            (date) =>
              differenceInDays(date, TODAY_MIDNIGHT) >= 0 &&
              differenceInDays(date, TODAY_MIDNIGHT) <= 3
          )
        })
        .toBe(true)
    })

    test('should be able to filter tasks by due in more than 3 days', async () => {
      const screen = page.render(<App />)

      await screen.getByRole('checkbox', { name: 'in 4+ days' }).click()

      await expect
        .poll(() => {
          const deadlineCellDates = screen
            .getByRole('cell', { name: 'deadline' })
            .elements()
            .map((el) => new Date(el.textContent!))

          return deadlineCellDates.every(
            (date) => differenceInDays(date, TODAY_MIDNIGHT) >= 4
          )
        })
        .toBe(true)
    })
  })

  describe('status filter', () => {
    test("should be able to filter tasks by 'In progress'", async () => {
      const screen = page.render(<App />)

      await screen.getByRole('checkbox', { name: 'in progress' }).click()

      await expect
        .poll(() => {
          const statusCellTexts = screen
            .getByRole('cell', { name: 'done' })
            .elements()
            .map((el) => el.textContent)

          return statusCellTexts.every((text) => text === 'In progress')
        })
        .toBe(true)
    })

    test("should be able to filter tasks by 'Done'", async () => {
      const screen = page.render(<App />)

      await screen.getByRole('checkbox', { name: 'done' }).click()

      await expect
        .poll(() => {
          const statusCellTexts = screen
            .getByRole('cell', { name: 'done' })
            .elements()
            .map((el) => el.textContent)

          return statusCellTexts.every((text) => text === 'Done')
        })
        .toBe(true)
    })
  })
})

describe('table pagination', () => {
  test('should be able to change page size', async () => {
    const screen = page.render(<App />)

    const pageSizeSelect = screen.getByRole('combobox', {
      name: 'page size',
    })

    for (const pageSize of [5, 10, 20]) {
      await pageSizeSelect.click()

      const pageSizeSelectListbox = screen.getByRole('listbox', {
        name: 'page-size-select-popover',
      })

      await expect.element(pageSizeSelectListbox).toBeVisible()

      await pageSizeSelectListbox
        .getByRole('option', {
          name: `${pageSize}`,
        })
        .click()
      await expect.element(pageSizeSelectListbox).not.toBeInTheDocument()

      expect(pageSizeSelect).toHaveTextContent(`${pageSize}`)

      await expect
        .poll(() => {
          const tableRows = document.querySelectorAll('tbody > tr')
          return tableRows.length
        })
        .toBe(pageSize)
    }
  })
})
