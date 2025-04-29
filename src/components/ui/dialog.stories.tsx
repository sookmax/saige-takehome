import type { Meta, StoryObj } from '@storybook/react'
import { Dialog, DialogTrigger, DialogTitle, DialogContent } from './dialog'
import { H1 } from './Typography'
import { Button } from './button'
import { CirclePlusIcon } from 'lucide-react'
import { TodoFormComponent } from './form.stories'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta = {
  title: 'Dialog',
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof meta>

function DefaultComponent() {
  return (
    <div className="flex items-center space-x-3">
      <H1>What needs to be done?</H1>
      <Dialog>
        <DialogTrigger asChild>
          <Button size="icon">
            <CirclePlusIcon className="size-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Task</DialogTitle>
          <div>
            <TodoFormComponent />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  render: DefaultComponent,
}
