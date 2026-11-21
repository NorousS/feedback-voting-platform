import type { ReactNode } from 'react'

type PageTitleProps = { title: string, description?: ReactNode }

export function PageTitle({ title, description }: PageTitleProps) {
  return (
    <header className="page-title">
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </header>
  )
}
