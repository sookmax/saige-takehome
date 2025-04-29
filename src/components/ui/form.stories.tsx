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

const FormSchema = z.object({
  task: z.string().min(1, { message: 'Write something about this task.' }),
})

function TextInputRequiredForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      task: '',
    },
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data: z.infer<typeof FormSchema>) => {
          console.log(data)
        })}
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
