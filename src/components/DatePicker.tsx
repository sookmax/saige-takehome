import React from 'react'
import { Calendar } from './ui/calendar'
import { DayPickerSingleProps } from 'react-day-picker'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

type DatePickerProps = { children: React.ReactNode } & Pick<
  DayPickerSingleProps,
  'selected' | 'onSelect' | 'disabled' | 'defaultMonth' | 'initialFocus'
> &
  Pick<React.ComponentPropsWithoutRef<typeof Popover>, 'open' | 'onOpenChange'>

export function DatePicker({
  open,
  onOpenChange,
  children,
  selected,
  onSelect,
  disabled,
  defaultMonth,
  initialFocus,
}: DatePickerProps) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={onSelect}
          disabled={disabled}
          defaultMonth={defaultMonth}
          initialFocus={initialFocus}
        />
      </PopoverContent>
    </Popover>
  )
}
