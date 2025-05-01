import { Table } from '@tanstack/react-table'
import { Checkbox } from './ui/checkbox'
import { Label } from './ui/label'
import { ToDo } from '@/types/api'

export const DUE_FILTER = {
  title: 'Due',
  options: {
    overdue: {
      label: 'Overdue',
      value: 'overdue',
    },
    in3Days: {
      label: 'In 3 days',
      value: 'in-3-days',
    },
    in4PlusDays: {
      label: 'In 4+ days',
      value: 'in-4-plus-days',
    },
  },
}

export const STATUS_FILTER = {
  title: 'Status',
  options: {
    inProgress: {
      label: 'In progress',
      value: 'in-progress',
    },
    done: {
      label: 'Done',
      value: 'done',
    },
  },
}

type TaskTableFilterProps = {
  table: Table<ToDo>
}
export function TaskTableFilter({ table }: TaskTableFilterProps) {
  const { columnFilters } = table.getState()

  const timeLeftFilter = columnFilters.find(
    (filter) => filter.id === 'time-left'
  )?.value as string[] | undefined

  const statusFilter = columnFilters.find((filter) => filter.id === 'done')
    ?.value as string[] | undefined

  return (
    <div className="space-y-10">
      <div className="space-y-2 text-xs font-medium">
        <div>{DUE_FILTER.title}</div>
        <div className="flex flex-col space-y-2">
          {Object.values(DUE_FILTER.options).map(({ label, value }) => (
            <div key={value} className="flex items-center space-x-1.5">
              <Checkbox
                id={value}
                value={value}
                checked={timeLeftFilter?.includes(value) ?? false}
                onCheckedChange={(checked) => {
                  if (checked) {
                    table
                      .getColumn('time-left')
                      ?.setFilterValue((old: string[] | undefined) => {
                        if (old === undefined) {
                          return [value]
                        } else {
                          return [...old, value]
                        }
                      })
                  } else {
                    table
                      .getColumn('time-left')
                      ?.setFilterValue((old: string[]) => {
                        const filtered = old.filter((item) => item !== value)
                        return filtered.length === 0 ? undefined : filtered
                      })
                  }
                }}
              />
              <Label htmlFor={value} className="text-xs leading-none">
                {label}
              </Label>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-2 text-xs font-medium">
        <div>{STATUS_FILTER.title}</div>
        <div className="flex flex-col space-y-2">
          {Object.values(STATUS_FILTER.options).map(({ label, value }) => (
            <div key={value} className="flex items-center space-x-1.5">
              <Checkbox
                id={value}
                value={value}
                checked={statusFilter?.includes(value) ?? false}
                onCheckedChange={(checked) => {
                  if (checked) {
                    table.getColumn('done')?.setFilterValue((old: string[]) => {
                      if (old === undefined) {
                        return [value]
                      } else {
                        return [...old, value]
                      }
                    })
                  } else {
                    table.getColumn('done')?.setFilterValue((old: string[]) => {
                      const filtered = old.filter((item) => item !== value)
                      return filtered.length === 0 ? undefined : filtered
                    })
                  }
                }}
              />
              <Label htmlFor={value} className="text-xs leading-none">
                {label}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
