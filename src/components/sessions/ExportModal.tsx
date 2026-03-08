import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

export type ExportFormat = 'csv' | 'json'

export interface ExportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (format: ExportFormat) => void
  isLoading?: boolean
  title?: string
  description?: string
}

/** Modal to choose export format (CSV/JSON) and confirm. */
export function ExportModal({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
  title = 'Export session',
  description = 'Choose format and download.',
}: ExportModalProps) {
  const [format, setFormat] = useState<ExportFormat>('csv')

  const handleConfirm = () => {
    onConfirm(format)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" aria-describedby="export-desc">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription id="export-desc">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label className="text-sm font-medium">Format</Label>
          <RadioGroup
            value={format}
            onValueChange={(v: string) => setFormat(v as ExportFormat)}
            className="mt-2 space-y-2"
            aria-label="Export format"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="csv" id="export-csv" aria-label="CSV" />
              <Label htmlFor="export-csv" className="font-normal cursor-pointer">
                CSV — spreadsheet-friendly, good for leads
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="json" id="export-json" aria-label="JSON" />
              <Label htmlFor="export-json" className="font-normal cursor-pointer">
                JSON — full transcript and metadata
              </Label>
            </div>
          </RadioGroup>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? 'Exporting…' : 'Export'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
