import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Button } from './Button'

describe('Button', () => {
  it('renders text with default variant and handles clicks', () => {
    const onClick = vi.fn()

    render(<Button onClick={onClick}>Проголосовать</Button>)

    const button = screen.getByRole('button', { name: 'Проголосовать' })

    expect(button).toHaveClass('ui-button--primary')
    fireEvent.click(button)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('supports a secondary variant and disabled state', () => {
    render(<Button variant="secondary" disabled className="extra">Назад</Button>)

    const button = screen.getByRole('button', { name: 'Назад' })

    expect(button).toHaveClass('ui-button--secondary', 'extra')
    expect(button).toBeDisabled()
  })
})
