import type { Meta, StoryObj } from '@storybook/react'
import { Checkbox } from './checkbox'
import { Label } from './label'
import { Button } from './button'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta = {
  title: 'Checkbox',
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Filters: Story = {
  render: () => (
    <div className="flex flex-col space-y-4">
      <div className="space-y-10">
        <div className="space-y-2 text-sm font-medium">
          <div>Due</div>
          <div className="flex flex-col space-y-2">
            {[
              {
                id: 'overdue',
                label: 'Overdue',
              },
              {
                id: 'in-3-days',
                label: 'In 3 days',
              },
              {
                id: 'in-4-plus-days',
                label: 'In 4+ days',
              },
            ].map(({ id, label }) => (
              <div key={id} className="flex items-center space-x-1.5">
                <Checkbox id={id} value={id} />
                <Label htmlFor={id} className="leading-none">
                  {label}
                </Label>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-2 text-sm font-medium">
          <div>Status</div>
          <div className="flex flex-col space-y-2">
            {[
              {
                id: 'in-progress',
                label: 'In progress',
              },
              {
                id: 'done',
                label: 'Done',
              },
            ].map(({ id, label }) => (
              <div key={id} className="flex items-center space-x-1.5">
                <Checkbox id={id} value={id} />
                <Label htmlFor={id} className="leading-none">
                  {label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>
        <Button variant="link" className="text-xs p-0">
          Clear filters
        </Button>
      </div>
    </div>
  ),
}
