import { CirclePlusIcon } from 'lucide-react'
import { Button } from './components/ui/button'
import { H1 } from './components/ui/Typography'
import { useState } from 'react'
import { TaskFormDialog } from './components/TaskFormDialog'
import { TaskTable } from './components/TaskTable'
import { AI_GENERATED_TODO_TITLES } from './lib/const'
import { ToDo } from './types/api'
import { TaskFormFields } from './components/TaskForm'

const mockData: ToDo[] = []
for (let i = 0; i < AI_GENERATED_TODO_TITLES.length; i++) {
  mockData.push({
    id: i,
    text: AI_GENERATED_TODO_TITLES[i],
    deadline:
      Math.random() > 0.5
        ? Date.now() + 86400000 * i
        : Date.now() - 86400000 * (i % 5),
    done: Math.random() > 0.5,
  })
}

export function App() {
  const [isTaskFormDialogOpen, setIsTaskFormDialogOpen] = useState(false)
  const [formInitialValues, setFormInitialValues] = useState<
    TaskFormFields | undefined
  >(undefined)

  return (
    <>
      <div className="min-h-screen max-w-[1000px] mx-auto flex flex-col items-center space-y-10">
        <div className="flex items-center space-x-3 my-10">
          <H1>What needs to be done?</H1>
          <Button
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
            data={mockData}
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
