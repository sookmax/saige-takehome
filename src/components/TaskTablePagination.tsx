import { Table } from '@tanstack/react-table'
import { Button } from './ui/button'
import { ToDo } from '@/types/api'
import { getPageIndices } from '@/lib/pagination'

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
      <div className="text-sm text-muted-foreground">
        {`Showing ${firstRowIndex + 1} to ${
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
  )
}
