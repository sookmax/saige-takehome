import { Meta, StoryObj } from '@storybook/react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip'
import { AI_GENERATED_TODO_TITLES } from '@/lib/const'

const meta: Meta = {
  title: 'Tooltip',
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="w-[100px] truncate">
          {AI_GENERATED_TODO_TITLES[0]}
        </TooltipTrigger>
        <TooltipContent>
          <p>{AI_GENERATED_TODO_TITLES[0]}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
}
