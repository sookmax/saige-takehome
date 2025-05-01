import { Meta, StoryObj } from '@storybook/react'
import { Badge } from './badge'

const meta: Meta = {
  title: 'Badge',
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    return (
      <div className="space-x-2">
        <Badge>Default</Badge>
        <Badge className="bg-in-progress text-in-progress-foreground">
          In progress
        </Badge>
        <Badge className="bg-done text-done-foreground">Done</Badge>
      </div>
    )
  },
}
