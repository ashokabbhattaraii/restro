import { Response } from 'express'

export function sendCSV(res: Response, filename: string, headers: string[], rows: Record<string, unknown>[]) {
  const escape = (val: unknown): string => {
    const str = String(val ?? '')
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }

  const headerLine = headers.join(',')
  const dataLines = rows.map((row) => headers.map((h) => escape(row[h])).join(','))

  const bom = '\uFEFF'
  const csv = bom + headerLine + '\n' + dataLines.join('\n')

  res.setHeader('Content-Type', 'text/csv; charset=utf-8')
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
  res.send(csv)
}
