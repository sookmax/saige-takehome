import { Table } from '@tanstack/react-table'
import { Button } from './ui/button'
import { ToDo } from '@/types/api'
import { getPageIndices } from '@/lib/pagination'
import { Label } from './ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'

const PAGE_SIZE = [5, 10, 20]

export function TaskTablePagination({ table }: { table: Table<ToDo> }) {
  const { pagination } = table.getState()

  const { pageIndex: currentPageIndex, pageSize } = pagination
  const pageIndices = getPageIndices(
    0,
    table.getPageCount() - 1,
    currentPageIndex,
    5
  )

  const totalRowCount = table.getRowCount()
  const firstRowIndex = currentPageIndex * pageSize
  const lastRowIndex = Math.min(firstRowIndex + pageSize - 1, totalRowCount - 1)

  return (
    <div className="flex items-center justify-between">
      <div className="text-xs text-muted-foreground">
        {totalRowCount === 0
          ? '0 results'
          : `Showing ${firstRowIndex + 1} to ${
              lastRowIndex + 1
            } of ${totalRowCount} results`}
      </div>
      <div className="space-x-1 flex justify-center">
        {pageIndices.map((pageIndex, index) => {
          return pageIndex === '...' ? (
            <span key={`ellipsis-${index}`}>...</span>
          ) : (
            <Button
              key={`page-${pageIndex}`}
              aria-label="pagination-button"
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
      <div className="flex items-center space-x-2 text-muted-foreground">
        <Label
          htmlFor="page-size-select-trigger"
          className="font-normal text-xs"
        >
          page size
        </Label>
        <Select
          value={String(pageSize)}
          onValueChange={(value) => table.setPageSize(Number(value))}
        >
          <SelectTrigger
            id="page-size-select-trigger"
            className="text-xs px-2 py-1"
            size="sm"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent aria-label="page-size-select-popover">
            {PAGE_SIZE.map((size) => (
              <SelectItem className="text-xs" key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
