import type { Meta, StoryObj } from '@storybook/react'

import { Button } from './button'
import { CirclePlusIcon } from 'lucide-react'
import { H1 } from './Typography'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof Button> = {
  title: 'Button',
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const AddIcon: Story = {
  render: () => {
    return (
      <div className="flex items-center space-x-3">
        <H1>What needs to be done?</H1>
        <Button size="icon">
          <CirclePlusIcon className="size-5" />
        </Button>
      </div>
    )
  },
}
