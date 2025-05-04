import { Meta, StoryObj } from '@storybook/react'
import { Toaster } from './sonner'
import { Button } from './button'
import { toast } from 'sonner'

const meta: Meta = {
  title: 'Sonner',
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof meta>

function DefaultComponent() {
  return (
    <>
      <Button
        onClick={() => {
          toast.success('Task has been created.')
        }}
      >
        Create Task
      </Button>
      <Toaster />
    </>
  )
}

export const Default: Story = {
  render: DefaultComponent,
}
