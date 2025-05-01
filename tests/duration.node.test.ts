import { expect, test } from 'vitest'
import { getDurationFromToday } from '../src/lib/duration'

const TEST_CASES = [
  [
    'overdue',
    new Date(Date.now() - 86400000 * 5),
    {
      isOverdue: true,
      isDueToday: false,
      isDueIn3Days: false,
      isDueIn4PlusDays: false,
    },
  ],
  [
    'due today',
    new Date(Date.now()),
    {
      isOverdue: false,
      isDueToday: true,
      isDueIn3Days: true,
      isDueIn4PlusDays: false,
    },
  ],
  [
    'due in 3 days',
    new Date(Date.now() + 86400000 * 3),
    {
      isOverdue: false,
      isDueToday: false,
      isDueIn3Days: true,
      isDueIn4PlusDays: false,
    },
  ],
  [
    'due in 4+ days',
    new Date(Date.now() + 86400000 * 5),
    {
      isOverdue: false,
      isDueToday: false,
      isDueIn3Days: false,
      isDueIn4PlusDays: true,
    },
  ],
] as const

TEST_CASES.forEach(([title, date, expected]) => {
  test(`should return the correct duration for '${title}' date`, () => {
    const { duration, ...rest } = getDurationFromToday(date)
    expect(rest).toEqual(expected)
  })
})
