import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-[14px] border border-transparent bg-clip-padding text-sm font-semibold whitespace-nowrap transition-[transform,background-color,border-color,opacity,box-shadow] duration-150 ease-out outline-none select-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98] active:duration-75 active:ease-out disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-[0_8px_22px_rgba(47,102,246,0.22)] hover:bg-primary/92 active:shadow-sm',
        outline:
          'border-border bg-card text-foreground hover:bg-muted/70 hover:border-primary/40 active:bg-muted',
        secondary:
          'bg-secondary text-primary hover:bg-secondary/80 active:bg-secondary/90',
        ghost:
          'hover:bg-muted/70 hover:text-foreground active:bg-muted',
        destructive:
          'bg-destructive/10 text-destructive hover:bg-destructive/20 active:bg-destructive/25 focus-visible:ring-destructive/40',
        link: 'text-primary underline-offset-4 hover:underline active:opacity-80',
        ember:
          'bg-ember text-[#14213d] font-bold shadow-[0_8px_22px_rgba(238,157,53,0.22)] hover:bg-ember/92 active:shadow-sm',
      },
      size: {
        default: 'h-11 px-4 gap-2 text-sm',
        sm: 'h-9 px-3 gap-1.5 text-xs rounded-lg',
        lg: 'h-12 px-6 gap-2.5 text-base',
        icon: 'size-10 rounded-[14px]',
        'icon-sm': 'size-8 rounded-lg',
        'icon-lg': 'size-12 rounded-2xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
