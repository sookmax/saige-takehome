import type { Meta, StoryObj } from '@storybook/react'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { Input } from './input'
import { Button } from './button'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { CalendarIcon, CirclePlusIcon, CircleXIcon } from 'lucide-react'
import { Calendar } from './calendar'
import { useState } from 'react'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta = {
  title: 'Form',
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof meta>

const TodoFormSchema = z.object({
  task: z
    .string()
    .trim()
    .min(1, { message: 'Write something about this task.' }),
  deadline: z.date().nullable(),
})

export function TodoFormComponent() {
  const form = useForm<z.infer<typeof TodoFormSchema>>({
    resolver: zodResolver(TodoFormSchema),
    defaultValues: {
      task: '',
      deadline: null,
    },
  })

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          (data: z.infer<typeof TextInputRequiredFormSchema>) => {
            console.log(data)
          }
        )}
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

export const TodoForm: Story = {
  render: TodoFormComponent,
}

const TextInputRequiredFormSchema = z.object({
  task: z
    .string()
    .trim()
    .min(1, { message: 'Write something about this task.' }),
})

function TextInputRequiredForm() {
  const form = useForm<z.infer<typeof TextInputRequiredFormSchema>>({
    resolver: zodResolver(TextInputRequiredFormSchema),
    defaultValues: {
      task: '',
    },
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(
          (data: z.infer<typeof TextInputRequiredFormSchema>) => {
            console.log(data)
          }
        )}
        className="w-2/3 space-y-6"
      >
        <FormField
          control={form.control}
          name="task"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <span>Description</span>
                <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="What needs to get done?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const TextInputRequired: Story = {
  render: TextInputRequiredForm,
}

const TODAY_MIDNIGHT = new Date()
TODAY_MIDNIGHT.setHours(0, 0, 0, 0)

const DatePickerDaysPastTodayDisabledFormSchema = z.object({
  deadline: z
    .date()
    .min(new Date(), {
      message: 'Deadline of the task should not be in the past!',
    })
    .optional(),
})

function DatePickerDaysPastTodayDisabledForm() {
  const form = useForm<
    z.infer<typeof DatePickerDaysPastTodayDisabledFormSchema>
  >({
    resolver: zodResolver(DatePickerDaysPastTodayDisabledFormSchema),
  })

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() => {
          console.log('Form submitted')
        })}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Deadline</FormLabel>
              <Popover
                open={isDatePickerOpen}
                onOpenChange={setIsDatePickerOpen}
              >
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-[240px] pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'yyyy-MM-dd')
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      field.onChange(date)
                      setIsDatePickerOpen(false)
                    }}
                    disabled={(date) => date < TODAY_MIDNIGHT}
                    defaultMonth={field.value}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}

export const DatePickerDaysPastTodayDisabled: Story = {
  render: DatePickerDaysPastTodayDisabledForm,
}
