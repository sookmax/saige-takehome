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
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { CalendarIcon, CirclePlusIcon, CircleXIcon } from 'lucide-react'
import { Calendar } from './ui/calendar'
import { TODAY_MIDNIGHT } from '@/lib/const'

const TaskFormSchema = z.object({
  task: z
    .string()
    .trim()
    .min(1, { message: 'Write something about this task.' }),
  deadline: z.date().nullable(),
})

export function TaskForm({
  initialValues,
}: {
  initialValues?: z.infer<typeof TaskFormSchema>
}) {
  const form = useForm<z.infer<typeof TaskFormSchema>>({
    resolver: zodResolver(TaskFormSchema),
    defaultValues: initialValues ?? {
      task: '',
      deadline: null,
    },
  })

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data: z.infer<typeof TaskFormSchema>) => {
          console.log(data)
        })}
        className="space-y-2"
      >
        <FormField
          control={form.control}
          name="task"
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
                <Popover
                  open={isDatePickerOpen}
                  onOpenChange={setIsDatePickerOpen}
                >
                  <PopoverTrigger asChild>
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
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ?? undefined}
                      onSelect={(date) => {
                        field.onChange(date)
                        setIsDatePickerOpen(false)
                      }}
                      disabled={(date) => date < TODAY_MIDNIGHT}
                      defaultMonth={field.value ?? undefined}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
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
            <CirclePlusIcon className="size-5" />
            <span>Add</span>
          </Button>
        </div>
      </form>
    </Form>
  )
}
