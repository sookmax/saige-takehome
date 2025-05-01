import React from 'react'
import { TaskForm } from './TaskForm'
import { Dialog, DialogContent, DialogTitle } from './ui/dialog'

type TaskFormDialogProps = Pick<
  React.ComponentPropsWithoutRef<typeof Dialog>,
  'open' | 'onOpenChange'
> &
  Pick<React.ComponentPropsWithoutRef<typeof TaskForm>, 'initialValues'>

export function TaskFormDialog({
  open,
  onOpenChange,
  initialValues,
}: TaskFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle>Task</DialogTitle>
        <div>
          <TaskForm initialValues={initialValues} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
