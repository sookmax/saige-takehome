import { APIResponse, ToDo } from '@/types/api'
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
import { Button } from './ui/button'
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'
import { TaskTableFilter } from './TaskTableFilter'
import { OverflowTooltip } from './OverflowTooltip'
import {
  SEARCH_PARAM_KEY_FOR_SEARCH_TEXT,
  SEARCH_PARAMS,
  TaskTableSearchInput,
} from './TaskTableSearchInput'
import { TaskTablePagination } from './TaskTablePagination'
import { useQuery } from '@tanstack/react-query'
import { Spinner } from './Spinner'

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
      <OverflowTooltip
        className="font-medium text-left cursor-pointer"
        delayDuration={150}
      >
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
            'text-left cursor-pointer',
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
  onRowClick?: (row: ToDo) => void
}

export function TaskTable({ onRowClick }: TaskTableProps) {
  const { isPending, error, data } = useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const { code, message, data } = (await fetch('/api/todos').then((res) =>
        res.json()
      )) as APIResponse<ToDo[]>
      if (code !== 200) {
        throw new Error(message)
      }

      return data
    },
  })

  const rows = data ?? []

  const table = useReactTable({
    data: rows,
    columns: COLUMNS,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: INITIAL_TABLE_STATE,
  })

  const rowsSelected = table.getSelectedRowModel().rows

  return (
    <div className="flex space-x-10 max-w-[1000px] mx-auto">
      <div className="shrink-0 flex flex-col mt-5">
        <TaskTableFilter table={table} />
      </div>
      <div className="grow flex flex-col space-y-2">
        <div className="flex items-center justify-between space-x-2">
          <div className="min-w-md">
            <TaskTableSearchInput table={table} />
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
              {isPending || rows.length === 0 || error ? (
                <TableRow>
                  <TableCell
                    colSpan={COLUMNS.length}
                    className="h-24 text-center"
                  >
                    {isPending ? (
                      <div className="h-full flex items-center justify-center space-x-2">
                        <span className="text-muted-foreground">
                          Fetching tasks...
                        </span>
                        <Spinner className="size-4" />
                      </div>
                    ) : error ? (
                      <div className="text-muted-foreground">
                        <div>Something went wrong, see below</div>
                        <div className="text-destructive font-medium">
                          {error.message}
                        </div>
                      </div>
                    ) : (
                      <div>No results.</div>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className={cn(onRowClick && 'cursor-pointer')}
                    onClick={() => {
                      onRowClick?.(row.original)
                    }}
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
              )}
            </TableBody>
          </Table>
        </div>
        <TaskTablePagination table={table} />
      </div>
    </div>
  )
}
