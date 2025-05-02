import { ToDo } from '@/types/api'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  InitialTableState,
  useReactTable,
} from '@tanstack/react-table'
import { Checkbox } from './ui/checkbox'
import { format, formatDuration } from 'date-fns'
import { DurationFromToday, getDurationFromToday } from '@/lib/duration'
import { cn } from '@/lib/utils'
import { Badge } from './ui/badge'
import { getPageIndices } from '@/lib/pagination'
import { useCallback, useEffect } from 'react'
import { Button } from './ui/button'
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  CircleXIcon,
  SearchIcon,
} from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'
import { TaskTableFilter } from './TaskTableFilter'
import { DebouncedInput } from './DebouncedInput'
import { OverflowTooltip } from './OverflowTooltip'

const columnHelper = createColumnHelper<ToDo>()

const COLUMN_WIDTHS: Record<string, number> = {
  select: 40,
  deadline: 120,
  'time-left': 120,
  done: 120,
}

const COLUMN_SELECT = columnHelper.display({
  id: 'select',
  header: ({ table }) => (
    <div className="flex items-center justify-center">
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    </div>
  ),
  cell: ({ row }) => (
    <div className="flex items-center justify-center">
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    </div>
  ),
  enableSorting: false,
})

const COLUMN_TASK = columnHelper.accessor('text', {
  header: 'Task',
  enableSorting: false,
  filterFn: 'includesString',
  cell: ({ getValue }) => {
    const text = getValue()
    return (
      <OverflowTooltip className="font-medium text-left" delayDuration={150}>
        {text}
      </OverflowTooltip>
    )
  },
})

const COLUMN_DEADLINE = columnHelper.accessor('deadline', {
  header: 'Due Date',
  cell: ({ getValue }) => {
    const dateMS = getValue()
    const date = new Date(dateMS)
    return (
      <div className="text-muted-foreground">{format(date, 'yyyy-MM-dd')}</div>
    )
  },
})

const COLUMN_TIME_LEFT = columnHelper.accessor(
  ({ deadline }) => {
    const date = new Date(deadline)
    return getDurationFromToday(date)
  },
  {
    id: 'time-left',
    header: 'Time Left',
    cell: ({ getValue, row }) => {
      const done = row.getValue<ToDo['done']>('done')
      const {
        isOverdue,
        isDueToday,
        isDueIn3Days,
        isDueIn4PlusDays,
        duration,
      } = getValue<DurationFromToday>()
      const text =
        isOverdue && done
          ? 'Completed'
          : isOverdue && !done
          ? 'Overdue'
          : isDueToday
          ? 'Due today'
          : `Due in ${formatDuration(duration)}`
      return (
        <OverflowTooltip
          className={cn(
            'text-left',
            isOverdue && !done && 'text-destructive',
            isOverdue && done && 'text-done-foreground',
            isDueIn3Days && 'text-warning-foreground',
            isDueIn4PlusDays && 'text-safe-foreground'
          )}
          delayDuration={150}
        >
          {text}
        </OverflowTooltip>
      )
    },
    sortingFn: (rowA, rowB) => {
      return (
        rowA.getValue<ToDo['deadline']>('deadline') -
        rowB.getValue<ToDo['deadline']>('deadline')
      )
    },
    filterFn: (row, _columnId, filterValue: string[]) => {
      const date = new Date(row.getValue<ToDo['deadline']>('deadline'))

      const { isOverdue, isDueIn3Days, isDueIn4PlusDays } =
        getDurationFromToday(date)

      let isMatch = false
      if (filterValue.includes('overdue')) {
        isMatch = isMatch || isOverdue
      }
      if (filterValue.includes('in-3-days')) {
        isMatch = isMatch || isDueIn3Days
      }
      if (filterValue.includes('in-4-plus-days')) {
        isMatch = isMatch || isDueIn4PlusDays
      }
      return isMatch
    },
  }
)

const COLUMN_STATUS = columnHelper.accessor('done', {
  header: 'Status',
  filterFn: (row, _columnId, filterValue: string[]) => {
    const done = row.getValue<ToDo['done']>('done')
    let isMatch = false
    if (filterValue.includes('done')) {
      isMatch = isMatch || done
    }
    if (filterValue.includes('in-progress')) {
      isMatch = isMatch || !done
    }
    return isMatch
  },
  cell: ({ getValue }) => {
    const done = getValue()
    return (
      <div>
        {done ? (
          <Badge className="bg-done text-done-foreground">Done</Badge>
        ) : (
          <Badge className="bg-in-progress text-in-progress-foreground">
            In progress
          </Badge>
        )}
      </div>
    )
  },
})

const COLUMNS = [
  COLUMN_SELECT,
  COLUMN_TASK,
  COLUMN_DEADLINE,
  COLUMN_TIME_LEFT,
  COLUMN_STATUS,
]

const SEARCH_PARAMS = new URLSearchParams(window.location.search)
const SEARCH_PARAM_KEY_FOR_SEARCH_TEXT = 'q'
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

const INITIAL_TABLE_STATE: InitialTableState = {
  pagination: {
    pageIndex: 0,
    pageSize: 10,
  },
  sorting: [
    {
      id: 'time-left',
      desc: false,
    },
  ],
  columnFilters: [
    {
      id: 'text',
      value: SEARCH_PARAMS.get(SEARCH_PARAM_KEY_FOR_SEARCH_TEXT) || '',
    },
    // {
    //   id: 'time-left',
    //   value: [DUE_FILTER.options.in3Days.value],
    // },
    // {
    //   id: 'done',
    //   value: [STATUS_FILTER.options.inProgress.value],
    // },
  ],
}

type TaskTableProps = {
  data: ToDo[]
}

export function TaskTable({ data }: TaskTableProps) {
  const table = useReactTable({
    data,
    columns: COLUMNS,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: INITIAL_TABLE_STATE,
  })

  const { pagination, columnFilters } = table.getState()

  const { pageIndex: currentPageIndex } = pagination
  const pageIndices = getPageIndices(
    0,
    table.getPageCount() - 1,
    currentPageIndex,
    5
  )

  const textFilter = columnFilters.find((filter) => filter.id === 'text')
  const textFilterValue = (textFilter?.value ?? '') as string

  const onSearchInputChange = useCallback(
    (value: string) => {
      table.getColumn('text')?.setFilterValue(value)
    },
    [table]
  )

  useEffect(() => {
    UPDATE_SEARCH_PARAM(SEARCH_PARAM_KEY_FOR_SEARCH_TEXT, textFilterValue)
  }, [textFilterValue])

  const rowsSelected = table.getSelectedRowModel().rows

  return (
    <div className="flex space-x-10 max-w-[1000px] mx-auto">
      <div className="shrink-0 flex flex-col mt-5">
        <TaskTableFilter table={table} />
      </div>
      <div className="grow flex flex-col space-y-2">
        <div className="flex items-center justify-between space-x-2">
          <div className="relative min-w-md">
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
          <div
            className={cn(rowsSelected.length > 0 ? 'visible' : 'invisible')}
          >
            <Button
              variant="destructive"
              className="text-xs transition-none h-auto px-2 py-1.5"
            >
              Delete {rowsSelected.length} row
              {rowsSelected.length > 1 ? 's' : ''}
            </Button>
          </div>
        </div>
        <div className="rounded-md border">
          <Table className="table-fixed">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const canSort = header.column.getCanSort()
                    const isSorted = header.column.getIsSorted()
                    const isSortedDesc = isSorted === 'desc'
                    const isSortedAsc = isSorted === 'asc'
                    return (
                      <TableHead
                        key={header.id}
                        style={{ width: COLUMN_WIDTHS[header.id] }}
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            className={cn(
                              'h-full flex items-center space-x-1.5',
                              canSort && 'cursor-pointer'
                            )}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            <div className={cn(!canSort && 'w-full')}>
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </div>
                            {!canSort ? null : isSortedAsc ? (
                              <ArrowUpIcon className="size-4" />
                            ) : isSortedDesc ? (
                              <ArrowDownIcon className="size-4" />
                            ) : (
                              <ArrowUpDownIcon className="size-4" />
                            )}
                          </div>
                        )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={COLUMNS.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="space-x-1 flex justify-center">
          {pageIndices.map((pageIndex, index) => {
            return pageIndex === '...' ? (
              <span key={`ellipsis-${index}`}>...</span>
            ) : (
              <Button
                key={`page-${pageIndex}`}
                variant={pageIndex === currentPageIndex ? 'default' : 'outline'}
                size="icon"
                onClick={() => table.setPageIndex(pageIndex)}
                className="h-8 w-8 transition-none"
              >
                {pageIndex + 1}
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
