import { cn } from '@/lib/utils'

export function H1({
  className,
  ...rest
}: React.HTMLProps<HTMLHeadingElement>) {
  return (
    <h1
      className={cn('text-4xl font-bold tracking-tight', className)}
      {...rest}
    />
  )
}
