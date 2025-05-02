import { CircleXIcon, SearchIcon } from 'lucide-react'
import { DebouncedInput } from './DebouncedInput'
import { cn } from '@/lib/utils'
import { Table } from '@tanstack/react-table'
import { ToDo } from '@/types/api'
import { useCallback, useEffect } from 'react'

export const SEARCH_PARAMS = new URLSearchParams(window.location.search)
export const SEARCH_PARAM_KEY_FOR_SEARCH_TEXT = 'q'
const UPDATE_SEARCH_PARAM = (key: string, value: string) => {
  if (!value) {
    SEARCH_PARAMS.delete(key)
  } else {
    SEARCH_PARAMS.set(key, value)
  }
  window.history.replaceState(
    {},
    '',
    `${window.location.pathname}${
      SEARCH_PARAMS.toString() ? `?${SEARCH_PARAMS.toString()}` : ''
    }`
  )
}

export function TaskTableSearchInput({ table }: { table: Table<ToDo> }) {
  const { columnFilters } = table.getState()

  const onSearchInputChange = useCallback(
    (value: string) => {
      table.getColumn('text')?.setFilterValue(value)
    },
    [table]
  )

  const textFilter = columnFilters.find((filter) => filter.id === 'text')
  const textFilterValue = (textFilter?.value ?? '') as string

  useEffect(() => {
    UPDATE_SEARCH_PARAM(SEARCH_PARAM_KEY_FOR_SEARCH_TEXT, textFilterValue)
  }, [textFilterValue])

  return (
    <div className="relative">
      <div className="absolute top-1/2 left-3 -translate-y-1/2 text-ring">
        <SearchIcon className="size-4" />
      </div>
      <DebouncedInput
        className="px-9 shadow-none"
        placeholder="Search tasks..."
        value={textFilterValue}
        onChange={onSearchInputChange}
      />
      <div
        className={cn(
          'absolute top-1/2 right-1 -translate-y-1/2 text-ring',
          textFilterValue ? 'visible' : 'invisible'
        )}
      >
        <button
          className="cursor-pointer p-2"
          onClick={() => table.getColumn('text')?.setFilterValue('')}
        >
          <CircleXIcon className="size-4 opacity-50" />
        </button>
      </div>
    </div>
  )
}
