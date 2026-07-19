'use client'
import { useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function AdminPagination({
  currentPage,
  totalPages,
  rowsPerPage,
  totalRows,
  onPageChange,
  onRowsPerPageChange,
}: {
  currentPage: number
  totalPages: number
  rowsPerPage: number
  totalRows: number
  onPageChange: (page: number) => void
  onRowsPerPageChange: (rows: number) => void
}) {
  const start = totalRows === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1
  const end = Math.min(currentPage * rowsPerPage, totalRows)

  const pages = useMemo(() => {
    const result: (number | 'dots')[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) result.push(i)
    } else {
      result.push(1)
      if (currentPage > 3) result.push('dots')
      const startPage = Math.max(2, currentPage - 1)
      const endPage = Math.min(totalPages - 1, currentPage + 1)
      for (let i = startPage; i <= endPage; i++) result.push(i)
      if (currentPage < totalPages - 2) result.push('dots')
      result.push(totalPages)
    }
    return result
  }, [currentPage, totalPages])

  return (
    <div className="admin-pagination">
      <div className="admin-pagination-info">
        Showing <strong>{start}</strong>–<strong>{end}</strong> of <strong>{totalRows}</strong>
      </div>
      <div className="admin-pagination-controls">
        <button
          type="button"
          className="admin-pagination-btn"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft size={15} />
        </button>
        {pages.map((p, i) =>
          p === 'dots' ? (
            <span key={`dots-${i}`} className="admin-pagination-dots">…</span>
          ) : (
            <button
              key={p}
              type="button"
              className={`admin-pagination-btn ${p === currentPage ? 'admin-pagination-btn--active' : ''}`}
              onClick={() => onPageChange(p)}
              aria-label={`Page ${p}`}
              aria-current={p === currentPage ? 'page' : undefined}
            >
              {p}
            </button>
          )
        )}
        <button
          type="button"
          className="admin-pagination-btn"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Next page"
        >
          <ChevronRight size={15} />
        </button>
      </div>
      <div className="admin-pagination-rows">
        <label>
          Rows per page:
          <select
            className="admin-select-sm"
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </label>
      </div>
    </div>
  )
}
