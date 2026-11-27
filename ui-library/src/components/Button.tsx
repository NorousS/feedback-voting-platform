import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: 'primary' | 'secondary'
}

export function Button({ children, variant = 'primary', className = '', ...props }: ButtonProps) {
  const classes = `ui-button ui-button--${variant} ${className}`.trim()

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
