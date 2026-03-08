import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FAQsAccordion } from './faqs-accordion'

const mockFaqs = [
  { id: 'a1', question: 'What is ConverseForms?', answer: 'An AI form builder.' },
  { id: 'a2', question: 'How do I publish?', answer: 'Use the Publish step.' },
]

describe('FAQsAccordion', () => {
  it('renders FAQ list and search input', () => {
    render(<FAQsAccordion faqs={mockFaqs} />)
    expect(screen.getByPlaceholderText(/search faqs/i)).toBeInTheDocument()
    expect(screen.getByText('What is ConverseForms?')).toBeInTheDocument()
    expect(screen.getByText('How do I publish?')).toBeInTheDocument()
  })

  it('filters FAQs by search query', async () => {
    const user = userEvent.setup()
    render(<FAQsAccordion faqs={mockFaqs} />)
    const search = screen.getByPlaceholderText(/search faqs/i)
    await user.type(search, 'publish')
    expect(screen.getByText('How do I publish?')).toBeInTheDocument()
    expect(screen.queryByText('What is ConverseForms?')).not.toBeInTheDocument()
  })

  it('uses default FAQs when faqs prop is empty', () => {
    render(<FAQsAccordion faqs={[]} />)
    expect(screen.getByText(/what is an ai form-agent/i)).toBeInTheDocument()
  })

  it('uses default FAQs when faqs prop is undefined', () => {
    render(<FAQsAccordion />)
    expect(screen.getByText(/what is an ai form-agent/i)).toBeInTheDocument()
  })
})
