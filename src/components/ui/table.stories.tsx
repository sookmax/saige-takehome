import { ToDo } from '@/types/api'
import type { Meta, StoryObj } from '@storybook/react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table'
import { format, formatDuration, intervalToDuration } from 'date-fns'
import { SEARCH_PARAMS, TODAY_MIDNIGHT } from '@/lib/const'
import { getPageIndices } from '@/lib/pagination'
import { Button } from './button'
import { cn } from '@/lib/utils'
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  CircleXIcon,
  SearchIcon,
} from 'lucide-react'
import { Checkbox } from './checkbox'
import { Label } from './label'
import { Input } from './input'
import { useEffect } from 'react'

const meta: Meta = {
  title: 'Table',
}

export default meta
type Story = StoryObj<typeof meta>

const mockData: ToDo[] = []
for (let i = 0; i < 100; i++) {
  mockData.push({
    id: i,
    text: `Task ${i}`,
    deadline:
      Math.random() > 0.5
        ? Date.now() + 86400000 * (i % 5)
        : Date.now() - 86400000 * (i % 5),
    done: Math.random() > 0.5,
  })
}

const columns: ColumnDef<ToDo>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'text',
    header: 'Task',
    enableSorting: false,
    filterFn: 'includesString',
  },
  {
    accessorKey: 'deadline',
    header: 'Deadline',
    cell: ({ getValue }) => {
      const dateMS = getValue<ToDo['deadline']>()
      const date = new Date(dateMS)
      date.setHours(0, 0, 0, 0)

      return format(date, 'yyyy-MM-dd')
    },
  },
  {
    id: 'time-left',
    header: 'Time Left',
    sortingFn: (rowA, rowB) => {
      return (
        rowA.getValue<ToDo['deadline']>('deadline') -
        rowB.getValue<ToDo['deadline']>('deadline')
      )
    },
    filterFn: (row, _columnId, filterValue: string[]) => {
      const date = new Date(row.getValue<ToDo['deadline']>('deadline'))
      date.setHours(0, 0, 0, 0)

      const duration = intervalToDuration({
        start: TODAY_MIDNIGHT,
        end: date,
      })

      const isOverdue = date < TODAY_MIDNIGHT
      const isDueIn3Days =
        duration.years === undefined &&
        duration.months === undefined &&
        duration.days !== undefined &&
        duration.days > -1 &&
        duration.days <= 3
      const isDueIn4PlusDays = duration.days !== undefined && duration.days > 3

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
    accessorFn: ({ done, deadline }) => {
      const date = new Date(deadline)
      date.setHours(0, 0, 0, 0)

      const duration = intervalToDuration({
        start: TODAY_MIDNIGHT,
        end: date,
      })

      const formattedDuration = formatDuration(duration)

      const isOverdue = date < TODAY_MIDNIGHT
      const isDue = date.getTime() === TODAY_MIDNIGHT.getTime()

      return isOverdue && done
        ? '-'
        : isOverdue && !done
        ? 'Overdue'
        : isDue
        ? 'Due Today'
        : `Due in ${formattedDuration}`
    },
  },
  {
    accessorKey: 'done',
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
      const done = getValue<ToDo['done']>()
      return done ? 'Done' : 'In Progress'
    },
  },
]

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

function DataTable<TData, TValue>({
  data,
  columns,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
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
          value: SEARCH_PARAMS.get('q') || '',
        },
        {
          id: 'time-left',
          value: ['in-3-days'],
        },
        {
          id: 'done',
          value: ['in-progress'],
        },
      ],
    },
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
  console.log('textFilterValue', textFilterValue)
  useEffect(() => {
    if (!textFilterValue) {
      SEARCH_PARAMS.delete('q')
    } else {
      SEARCH_PARAMS.set('q', textFilterValue)
    }
    window.history.replaceState(
      {},
      '',
      `${window.location.pathname}?${SEARCH_PARAMS.toString()}`
    )
  }, [textFilterValue])

  const timeLeftFilter = columnFilters.find(
    (filter) => filter.id === 'time-left'
  )?.value as string[] | undefined

  const statusFilter = columnFilters.find((filter) => filter.id === 'done')
    ?.value as string[] | undefined

  const rowsSelected = table.getSelectedRowModel().rows

  return (
    <div className="flex space-x-10">
      <div className="flex flex-col space-y-4">
        <div className="space-y-10">
          <div className="space-y-2 text-xs font-medium">
            <div>Due</div>
            <div className="flex flex-col space-y-2">
              {[
                {
                  id: 'overdue',
                  label: 'Overdue',
                },
                {
                  id: 'in-3-days',
                  label: 'In 3 days',
                },
                {
                  id: 'in-4-plus-days',
                  label: 'In 4+ days',
                },
              ].map(({ id, label }) => (
                <div key={id} className="flex items-center space-x-1.5">
                  <Checkbox
                    id={id}
                    value={id}
                    checked={timeLeftFilter?.includes(id) ?? false}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        table
                          .getColumn('time-left')
                          ?.setFilterValue((old: string[] | undefined) => {
                            if (old === undefined) {
                              return [id]
                            } else {
                              return [...old, id]
                            }
                          })
                      } else {
                        table
                          .getColumn('time-left')
                          ?.setFilterValue((old: string[]) => {
                            const filtered = old.filter((value) => value !== id)
                            return filtered.length === 0 ? undefined : filtered
                          })
                      }
                    }}
                  />
                  <Label htmlFor={id} className="text-xs leading-none">
                    {label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2 text-xs font-medium">
            <div>Status</div>
            <div className="flex flex-col space-y-2">
              {[
                {
                  id: 'in-progress',
                  label: 'In progress',
                },
                {
                  id: 'done',
                  label: 'Done',
                },
              ].map(({ id, label }) => (
                <div key={id} className="flex items-center space-x-1.5">
                  <Checkbox
                    id={id}
                    value={id}
                    checked={statusFilter?.includes(id) ?? false}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        table
                          .getColumn('done')
                          ?.setFilterValue((old: string[]) => {
                            if (old === undefined) {
                              return [id]
                            } else {
                              return [...old, id]
                            }
                          })
                      } else {
                        table
                          .getColumn('done')
                          ?.setFilterValue((old: string[]) => {
                            const filtered = old.filter((value) => value !== id)
                            return filtered.length === 0 ? undefined : filtered
                          })
                      }
                    }}
                  />
                  <Label htmlFor={id} className="text-xs leading-none">
                    {label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <Button
            variant="link"
            className="text-xs p-0"
            onClick={() => {
              table.setColumnFilters((old) => {
                const textFilter = old.find((filter) => filter.id === 'text')
                if (!textFilter) return []
                return [textFilter]
              })
            }}
          >
            Clear filters
          </Button>
        </div>
      </div>
      <div className="grow flex flex-col space-y-2">
        <div className="flex items-center justify-between space-x-2">
          <div className="relative min-w-md">
            <div className="absolute top-1/2 left-3 -translate-y-1/2 text-ring">
              <SearchIcon className="size-4" />
            </div>
            <Input
              className="px-9 shadow-none"
              placeholder="Search tasks..."
              value={textFilterValue}
              onChange={(e) => {
                table.getColumn('text')?.setFilterValue(e.target.value)
              }}
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
              className="text-xs transition-none h-auto px-3 py-2"
            >
              Delete {rowsSelected.length} row
              {rowsSelected.length > 1 ? 's' : ''}
            </Button>
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const canSort = header.column.getCanSort()
                    const isSorted = header.column.getIsSorted()
                    const isSortedDesc = isSorted === 'desc'
                    const isSortedAsc = isSorted === 'asc'
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : (
                          <div
                            className={cn(
                              'h-full flex items-center space-x-1.5',
                              canSort && 'cursor-pointer'
                            )}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            <span>
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                            </span>
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
                    colSpan={columns.length}
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

export const Default: Story = {
  render: () => {
    const data = mockData.filter((row) => {
      if (!row.done) return true
      const date = new Date(row.deadline)
      date.setHours(0, 0, 0, 0)
      return (
        date > TODAY_MIDNIGHT || date.getTime() === TODAY_MIDNIGHT.getTime()
      )
    })
    return <DataTable data={data} columns={columns} />
  },
}
