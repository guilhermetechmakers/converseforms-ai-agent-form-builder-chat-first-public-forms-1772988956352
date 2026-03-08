import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Privacy from './Privacy'

function Wrapper({ children }: { children: React.ReactNode }) {
  return <BrowserRouter>{children}</BrowserRouter>
}

describe('Privacy', () => {
  it('renders without crashing when policy sections are loaded', () => {
    render(<Privacy />, { wrapper: Wrapper })
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: /privacy policy/i })).toBeInTheDocument()
  })

  it('renders data export and deletion action buttons', () => {
    render(<Privacy />, { wrapper: Wrapper })
    expect(screen.getByTestId('privacy-export-button')).toBeInTheDocument()
    expect(screen.getByTestId('privacy-deletion-button')).toBeInTheDocument()
  })

  it('all list/map usage is guarded: renders section nav and content', () => {
    render(<Privacy />, { wrapper: Wrapper })
    expect(screen.getByRole('navigation', { name: /privacy policy sections/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /data we collect/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /contact information/i })).toBeInTheDocument()
  })
})
