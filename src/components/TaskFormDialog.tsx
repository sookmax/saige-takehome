import React, { useState } from 'react'
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
  const [isFormSubmitting, setIsFormSubmitting] = useState(false)
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (isFormSubmitting) return
        onOpenChange?.(open)
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogTitle>Task</DialogTitle>
        <div>
          <TaskForm
            initialValues={initialValues}
            onMutationSuccess={() => onOpenChange?.(false)}
            onPendingChange={setIsFormSubmitting}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
