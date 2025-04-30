import { ToDo } from '@/types/api'
import type { Meta, StoryObj } from '@storybook/react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
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
import { formatDuration, intervalToDuration } from 'date-fns'
import { TODAY_MIDNIGHT } from '@/lib/const'

const meta: Meta = {
  title: 'Table',
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof meta>

const mockData: ToDo[] = []
for (let i = 0; i < 100; i++) {
  mockData.push({
    id: i,
    text: `Task ${i}`,
    deadline: Date.now() + 86400000 * i,
    done: Math.random() > 0.5,
  })
}

const columns: ColumnDef<ToDo>[] = [
  {
    accessorKey: 'text',
    header: 'Task',
  },
  {
    accessorKey: 'deadline',
    header: 'Deadline',
    cell: ({ getValue }) => {
      const date = new Date(getValue<ToDo['deadline']>())
      date.setHours(0, 0, 0, 0)
      const duration = intervalToDuration({
        start: TODAY_MIDNIGHT,
        end: date,
      })
      const formattedDuration = formatDuration(duration)
      return formattedDuration !== '' ? `${formattedDuration} left` : 'D-day'
    },
  },
  {
    accessorKey: 'done',
    header: 'Done',
    cell: (info) => {
      return info.getValue() ? '✔️' : '❌'
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
  })

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export const Default: Story = {
  render: () => (
    <div className="container mx-auto py-10">
      <DataTable data={mockData} columns={columns} />
    </div>
  ),
}
