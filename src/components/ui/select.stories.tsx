import { Meta, StoryObj } from '@storybook/react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select'
import { Label } from './label'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta = {
  title: 'Select',
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof meta>

const PAGE_SIZE = [5, 10, 20]

export const PageSize: Story = {
  render: () => {
    return (
      <div className="flex items-center space-x-2 text-muted-foreground">
        <Label htmlFor="page-size-select-trigger">page size</Label>
        <Select defaultValue="10">
          <SelectTrigger id="page-size-select-trigger" className="min-w-[70px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PAGE_SIZE.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  },
}
