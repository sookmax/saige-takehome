import React, { useCallback, useEffect, useState } from 'react'
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from './ui/tooltip'
import { cn } from '@/lib/utils'

type OverflowTooltipProps = {
  children: string
  className?: string
} & Pick<React.ComponentPropsWithoutRef<typeof Tooltip>, 'delayDuration'> &
  Pick<React.ComponentPropsWithoutRef<typeof TooltipContent>, 'align'>

export function OverflowTooltip({
  children,
  className,
  delayDuration = 0,
  align,
}: OverflowTooltipProps) {
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

  const onMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (requsetOpen) return
      const button = e.currentTarget
      const span = button.querySelector('span') as HTMLSpanElement
      if (span.offsetWidth > button.offsetWidth) {
        setRequestOpen(true)
      }
    },
    [requsetOpen]
  )

  const onMouseLeave = useCallback(() => {
    if (!requsetOpen) return
    setRequestOpen(false)
    setOpen(false)
  }, [requsetOpen])

  return (
    <TooltipProvider>
      <Tooltip open={open} delayDuration={delayDuration}>
        <TooltipTrigger
          className={cn('w-full max-w-fit truncate', className)}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <span>{children}</span>
        </TooltipTrigger>
        <TooltipContent align={align}>
          <p>{children}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
