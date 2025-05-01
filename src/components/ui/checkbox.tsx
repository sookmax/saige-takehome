import React, { useState } from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { CheckIcon, MinusIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

function Checkbox({
  className,
  checked: checkedProp,
  onCheckedChange: onCheckedChangeProp,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  const [_checked, _setChecked] = useState(checkedProp ?? false)

  const checked = checkedProp ?? _checked
  const onCheckedChange = (checked: CheckboxPrimitive.CheckedState) => {
    onCheckedChangeProp?.(checked)
    _setChecked(checked)
  }

  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      checked={checked}
      onCheckedChange={onCheckedChange}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        {checked === true && <CheckIcon className="size-3.5" />}
        {checked === 'indeterminate' && <MinusIcon className="size-3.5" />}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
