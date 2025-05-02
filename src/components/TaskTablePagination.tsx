import { Table } from '@tanstack/react-table'
import { Button } from './ui/button'
import { ToDo } from '@/types/api'
import { getPageIndices } from '@/lib/pagination'

export function TaskTablePagination({ table }: { table: Table<ToDo> }) {
  const { pagination } = table.getState()

  const { pageIndex: currentPageIndex } = pagination
  const pageIndices = getPageIndices(
    0,
    table.getPageCount() - 1,
    currentPageIndex,
    5
  )

  return (
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
  )
}
