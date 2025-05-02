import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
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
import {
  CalendarIcon,
  CircleArrowUp,
  CirclePlusIcon,
  CircleXIcon,
} from 'lucide-react'
import { TODAY_MIDNIGHT } from '@/lib/const'
import { DatePicker } from './DatePicker'

const TaskFormSchema = z.object({
  id: z.number().optional(),
  text: z
    .string()
    .trim()
    .min(1, { message: 'Write something about this task.' }),
  done: z.boolean().optional(),
  deadline: z.date().nullable(),
})

export type TaskFormFields = z.infer<typeof TaskFormSchema>

export function TaskForm({
  initialValues,
}: {
  initialValues?: TaskFormFields
}) {
  const type = initialValues?.id ? 'update' : 'create'

  const form = useForm<TaskFormFields>({
    resolver: zodResolver(TaskFormSchema),
    defaultValues: initialValues ?? {
      text: '',
      deadline: null,
    },
  })

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data: TaskFormFields) => {
          console.log(data)
        })}
        className="space-y-2"
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
                {field.value && (
                  <button
                    type="button"
                    className="absolute top-1/2 -translate-y-1/2 right-8 cursor-pointer p-2"
                    onClick={() => {
                      field.onChange(null)
                    }}
                  >
                    <CircleXIcon className="size-4 opacity-50" />
                  </button>
                )}
              </FormItem>
            )}
          />
          <Button type="submit">
            {type === 'create' ? (
              <>
                <CirclePlusIcon className="size-5" />
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
