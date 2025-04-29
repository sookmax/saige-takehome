import type { Meta, StoryObj } from '@storybook/react'

import { Input } from './input'
import { SearchIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta: Meta<typeof Input> = {
  title: 'Input',
  component: Input,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // https://github.com/storybookjs/storybook/issues/24656#issuecomment-1859975897
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

const PARAMS = new URLSearchParams(window.location.search)
function SearchInput() {
  const [value, setValue] = useState(PARAMS.get('q') || '')

  useEffect(() => {
    if (!value) {
      PARAMS.delete('q')
    } else {
      PARAMS.set('q', value)
    }
    window.history.replaceState(
      {},
      '',
      `${window.location.pathname}?${PARAMS.toString()}`
    )
  }, [value])

  return (
    <div className="relative">
      <span className="absolute top-1/2 left-3 -translate-y-1/2 text-ring">
        <SearchIcon className="size-4" />
      </span>
      <Input
        className="pl-9"
        placeholder="Search tasks..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  )
}

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Search: Story = {
  render: SearchInput,
}
