import * as React from "react"
import { cn } from "@/lib/utils"

export type ButtonVariant = "default" | "outline" | "secondary" | "ghost" | "destructive" | "link"
export type ButtonSize = "default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

const variantStyles: Record<ButtonVariant, string> = {
  default: "bg-primary text-primary-foreground hover:bg-primary/80",
  outline: "border-border hover:bg-input/50 hover:text-foreground dark:bg-input/30",
  secondary: "bg-secondary text-secondary-foreground hover:bg-muted dark:bg-secondary",
  ghost: "hover:bg-muted hover:text-foreground dark:hover:bg-muted/50",
  destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20 dark:bg-destructive/20",
  link: "text-primary underline-offset-4 hover:underline",
}

const sizeStyles: Record<ButtonSize, string> = {
  default: "h-7 gap-1 px-2 text-xs/relaxed",
  xs: "h-5 gap-1 rounded-sm px-2 text-[0.625rem]",
  sm: "h-6 gap-1 px-2 text-xs/relaxed",
  lg: "h-8 gap-1 px-2.5 text-xs/relaxed",
  icon: "size-7",
  "icon-xs": "size-5 rounded-sm",
  "icon-sm": "size-6",
  "icon-lg": "size-8",
}

const baseStyles = "group/button inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-xs/relaxed font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

export function buttonVariants(options?: { variant?: ButtonVariant; size?: ButtonSize; className?: string }) {
  const variant = options?.variant || "default"
  const size = options?.size || "default"
  return cn(baseStyles, variantStyles[variant], sizeStyles[size], options?.className)
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        data-slot="button"
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
