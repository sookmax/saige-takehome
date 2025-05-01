import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'

type DebouncedInputProps<T> = {
  value: T
  onChange: (value: T) => void
  wait?: number
} & Omit<React.ComponentPropsWithoutRef<typeof Input>, 'value' | 'onChange'>

export function DebouncedInput<T extends string | number>({
  value,
  onChange,
  wait = 500,
  ...rest
}: DebouncedInputProps<T>) {
  const [_value, _setValue] = useState(value)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onChange?.(_value)
    }, wait)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [_value, onChange, wait])

  // Need to update the internal value when provided value changes, not from the input, but from something else
  // (e.g., clear input button in anscestor component)
  useEffect(() => {
    _setValue(value)
  }, [value])

  return (
    <Input
      value={_value}
      onChange={(e) => _setValue(e.target.value as T)}
      {...rest}
    />
  )
}
