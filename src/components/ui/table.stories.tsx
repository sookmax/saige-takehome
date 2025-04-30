import { ToDo } from '@/types/api'
import type { Meta, StoryObj } from '@storybook/react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
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
import { TODAY_MIDNIGHT } from '@/lib/const'
import { getPageIndices } from '@/lib/pagination'
import { Button } from './button'
import { cn } from '@/lib/utils'
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from 'lucide-react'

const meta: Meta = {
  title: 'Table',
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-[500px]">
        <Story />
      </div>
    ),
  ],
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
        ? Date.now() + 86400000 * i
        : Date.now() - 86400000 * i,
    done: Math.random() > 0.5,
  })
}

const columns: ColumnDef<ToDo>[] = [
  {
    accessorKey: 'text',
    header: 'Task',
    enableSorting: false,
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
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
  })

  const { pageIndex: currentPageIndex } = table.getState().pagination
  const pageIndices = getPageIndices(
    0,
    table.getPageCount() - 1,
    currentPageIndex,
    5
  )

  return (
    <div className="flex flex-col space-y-4">
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
              className="h-8 w-8"
            >
              {pageIndex + 1}
            </Button>
          )
        })}
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
    return (
      <div className="container mx-auto py-10">
        <DataTable data={data} columns={columns} />
      </div>
    )
  },
}
