import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { CirclePlusIcon } from 'lucide-react'
import { Button } from './components/ui/button'
import { H1 } from './components/ui/Typography'
import { useState } from 'react'
import { TaskFormDialog } from './components/TaskFormDialog'
import { TaskTable } from './components/TaskTable'
import { TaskFormFields } from './components/TaskForm'
import { Toaster } from './components/ui/sonner'

const QUERY_CLIENT = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client={QUERY_CLIENT}>
      <AppInner />
      <Toaster />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

function AppInner() {
  const [isTaskFormDialogOpen, setIsTaskFormDialogOpen] = useState(false)
  const [formInitialValues, setFormInitialValues] = useState<
    TaskFormFields | undefined
  >(undefined)

  return (
    <>
      <div className="min-h-screen max-w-[1000px] mx-auto py-10 flex flex-col items-center space-y-10">
        <div className="flex items-center space-x-3 mb-10">
          <H1>What needs to be done?</H1>
          <Button
            aria-label="add task"
            size="icon"
            onClick={() => {
              setFormInitialValues(undefined)
              setIsTaskFormDialogOpen(true)
            }}
          >
            <CirclePlusIcon className="size-5" />
          </Button>
        </div>
        <div>
          <TaskTable
            onRowClick={(row) => {
              setFormInitialValues({
                id: row.id,
                text: row.text,
                deadline: new Date(row.deadline),
                done: row.done,
              })
              setIsTaskFormDialogOpen(true)
            }}
          />
        </div>
      </div>
      <TaskFormDialog
        open={isTaskFormDialogOpen}
        initialValues={formInitialValues}
        onOpenChange={setIsTaskFormDialogOpen}
      />
    </>
  )
}
