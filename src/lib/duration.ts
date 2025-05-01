import { intervalToDuration } from 'date-fns'
import { TODAY_MIDNIGHT } from './const'

export type DurationFromToday = ReturnType<typeof getDurationFromToday>
export function getDurationFromToday(date: Date) {
  const endDate = new Date(date) // copy date to avoid mutating the original
  endDate.setHours(0, 0, 0, 0)

  const duration = intervalToDuration({
    start: TODAY_MIDNIGHT,
    end: endDate,
  })

  const isOverdue = date < TODAY_MIDNIGHT
  const isDueToday =
    duration.years === undefined &&
    duration.months === undefined &&
    duration.weeks === undefined &&
    duration.days === undefined
  const isDueIn3Days =
    isDueToday ||
    (duration.years === undefined &&
      duration.months === undefined &&
      duration.weeks === undefined &&
      duration.days !== undefined &&
      duration.days > 0 &&
      duration.days <= 3)
  const isDueIn4PlusDays = duration.days !== undefined && duration.days > 3

  return {
    isOverdue,
    isDueToday,
    isDueIn3Days,
    isDueIn4PlusDays,
    duration,
  }
}
