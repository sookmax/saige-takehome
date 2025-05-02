import { Meta, StoryObj } from '@storybook/react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip'
import { AI_GENERATED_TODO_TITLES } from '@/lib/const'
import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

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

function OverflowTooltip({
  children,
  className,
  delayDuration = 0,
}: { children: string; className?: string } & Pick<
  React.ComponentPropsWithoutRef<typeof Tooltip>,
  'delayDuration'
>) {
  const [open, setOpen] = useState(false)
  const [requsetOpen, setRequestOpen] = useState(false)
  useEffect(() => {
    if (requsetOpen) {
      const timeoutId = setTimeout(() => {
        setOpen(true)
      }, delayDuration)

      return () => {
        clearTimeout(timeoutId)
      }
    }
  }, [requsetOpen, delayDuration])
  return (
    <TooltipProvider>
      <Tooltip open={open} delayDuration={delayDuration}>
        <TooltipTrigger
          className={cn('w-full max-w-fit truncate', className)}
          onMouseEnter={(e) => {
            const button = e.currentTarget as HTMLButtonElement
            const span = button.querySelector('span') as HTMLSpanElement
            console.log(span.offsetWidth, button.offsetWidth)
            if (span.offsetWidth > button.offsetWidth) {
              setRequestOpen(true)
            }
          }}
          onMouseLeave={() => {
            setRequestOpen(false)
            setOpen(false)
          }}
        >
          <span>{children}</span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{children}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

function OnlyActiveWhenOverflowComponent() {
  return (
    <div className="w-[200px]">
      <OverflowTooltip delayDuration={500}>
        {AI_GENERATED_TODO_TITLES[0]}
      </OverflowTooltip>
      <OverflowTooltip>Fix mobile nav</OverflowTooltip>
    </div>
  )
}

export const OnlyActiveWhenOverflow: Story = {
  render: OnlyActiveWhenOverflowComponent,
}
