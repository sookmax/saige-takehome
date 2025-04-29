import type { Meta, StoryObj } from '@storybook/react'

import { Input } from './input'
import { SearchIcon } from 'lucide-react'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Input',
  component: Input,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Search: Story = {
  render: () => (
    <div className="w-[400px]">
      <div className="relative">
        <span className="absolute top-1/2 left-3 -translate-y-1/2 text-ring">
          <SearchIcon className="size-4" />
        </span>
        <Input className="pl-9" placeholder="Search tasks..." />
      </div>
    </div>
  ),
}
