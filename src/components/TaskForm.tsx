import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { CalendarIcon, CircleArrowUp, CirclePlusIcon } from 'lucide-react'
import { TODAY_MIDNIGHT } from '@/lib/const'
import { DatePicker } from './DatePicker'
import { Checkbox } from './ui/checkbox'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Spinner } from './Spinner'
import { upsertTodo } from '@/lib/fetch'
import { toast } from 'sonner'

const TaskFormSchema = z.object({
  id: z.number().optional(),
  text: z
    .string()
    .trim()
    .min(1, { message: 'Write something descriptive about this task.' }),
  done: z.boolean().optional(),
  deadline: z.date({
    required_error: 'Without a deadline, a task would not be a task, would it?',
  }),
})

export type TaskFormFields = z.infer<typeof TaskFormSchema>

export function TaskForm({
  initialValues,
  onMutationSuccess,
  onPendingChange,
}: {
  initialValues?: TaskFormFields
  onMutationSuccess?: () => void
  onPendingChange?: (pending: boolean) => void
}) {
  const formType = initialValues?.id !== undefined ? 'update' : 'create'

  const queryClient = useQueryClient()

  const upsertMutation = useMutation({
    mutationFn: upsertTodo,
    onSuccess: (todo) => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      toast.success(
        formType === 'create' ? (
          <span>
            Task: <strong>{todo.text}</strong> has been created.
          </span>
        ) : (
          <span>
            Task: <strong>{todo.text}</strong> has been updated.
          </span>
        )
      )
      onMutationSuccess?.()
    },
  })

  // This is to temporarily disable closing of the dialog when the form is submitting
  useEffect(() => {
    onPendingChange?.(upsertMutation.isPending)
  }, [upsertMutation.isPending, onPendingChange])

  const form = useForm<TaskFormFields>({
    resolver: zodResolver(TaskFormSchema),
    defaultValues: initialValues ?? {
      text: '',
      done: false,
    },
    disabled: upsertMutation.isPending,
  })

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data: TaskFormFields) => {
          upsertMutation.mutate(data)
        })}
        className="space-y-3"
      >
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <VisuallyHidden>
                <FormLabel>
                  <span>Task description</span>
                  <span className="text-destructive">*</span>
                </FormLabel>
              </VisuallyHidden>
              <FormControl>
                <Input placeholder="What needs to get done?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => (
              <FormItem className="relative grow flex flex-col">
                <VisuallyHidden>
                  <FormLabel>Deadline date</FormLabel>
                </VisuallyHidden>
                <DatePicker
                  open={isDatePickerOpen}
                  onOpenChange={setIsDatePickerOpen}
                  selected={field.value ?? undefined}
                  onSelect={(date) => {
                    field.onChange(date)
                    setIsDatePickerOpen(false)
                  }}
                  disabled={(date) => date < TODAY_MIDNIGHT}
                  defaultMonth={field.value ?? undefined}
                  initialFocus
                >
                  <FormControl>
                    <Button
                      type="button"
                      variant={'outline'}
                      disabled={field.disabled}
                      className={cn(
                        'w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'yyyy-MM-dd')
                      ) : (
                        <span>Pick a deadline</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </DatePicker>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="done"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-1.5 gap-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={formType === 'create' || field.disabled}
                  />
                </FormControl>
                <FormLabel>Done</FormLabel>
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col">
          <Button type="submit" disabled={form.formState.disabled}>
            {formType === 'create' ? (
              <>
                {upsertMutation.isPending ? (
                  <Spinner className="text-primary-foreground size-4" />
                ) : (
                  <CirclePlusIcon className="size-5" />
                )}
                <span>Add</span>
              </>
            ) : (
              <>
                <CircleArrowUp className="size-5" />
                <span>Update</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
