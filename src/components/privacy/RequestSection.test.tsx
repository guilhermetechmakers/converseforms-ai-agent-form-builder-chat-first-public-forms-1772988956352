import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RequestSection } from './RequestSection'

describe('RequestSection', () => {
  it('renders export and deletion buttons', () => {
    render(<RequestSection />)
    expect(screen.getByTestId('privacy-export-button')).toBeInTheDocument()
    expect(screen.getByTestId('privacy-deletion-button')).toBeInTheDocument()
  })

  it('export button is not null and has accessible label', () => {
    render(<RequestSection />)
    const exportBtn = screen.getByTestId('privacy-export-button')
    expect(exportBtn).not.toBeNull()
    expect(exportBtn).toHaveAttribute('aria-label', 'Request data export')
  })

  it('deletion button is not null and has accessible label', () => {
    render(<RequestSection />)
    const deletionBtn = screen.getByTestId('privacy-deletion-button')
    expect(deletionBtn).not.toBeNull()
    expect(deletionBtn).toHaveAttribute('aria-label', 'Request data deletion')
  })

  it('calls onExportRequest when export button is clicked', async () => {
    const user = userEvent.setup()
    const onExport = vi.fn()
    render(<RequestSection onExportRequest={onExport} />)
    await user.click(screen.getByTestId('privacy-export-button'))
    expect(onExport).toHaveBeenCalledTimes(1)
  })

  it('calls onDeletionRequest when deletion button is clicked', async () => {
    const user = userEvent.setup()
    const onDeletion = vi.fn()
    render(<RequestSection onDeletionRequest={onDeletion} />)
    await user.click(screen.getByTestId('privacy-deletion-button'))
    expect(onDeletion).toHaveBeenCalledTimes(1)
  })
})
