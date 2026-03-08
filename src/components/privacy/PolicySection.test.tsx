import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PolicySection } from './PolicySection'

describe('PolicySection', () => {
  it('renders title and content', () => {
    render(
      <PolicySection
        id="test"
        title="Test Section"
        content="Test body text."
      />
    )
    expect(screen.getByRole('heading', { name: /test section/i })).toBeInTheDocument()
    expect(screen.getByText('Test body text.')).toBeInTheDocument()
  })

  it('renders subpoints when provided', () => {
    render(
      <PolicySection
        id="test"
        title="Test"
        content="Body"
        subpoints={['Point one', 'Point two']}
      />
    )
    expect(screen.getByText('Point one')).toBeInTheDocument()
    expect(screen.getByText('Point two')).toBeInTheDocument()
  })

  it('does not crash when subpoints is undefined', () => {
    render(
      <PolicySection id="test" title="Test" content="Body" />
    )
    expect(screen.getByText('Body')).toBeInTheDocument()
  })

  it('does not crash when content is empty string', () => {
    render(
      <PolicySection id="test" title="Test" content="" />
    )
    expect(screen.getByRole('heading', { name: /test/i })).toBeInTheDocument()
  })
})
