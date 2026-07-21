'use client'

import { useEffect, useCallback } from 'react'
import type { UseFormReturn, FieldValues, Path } from 'react-hook-form'

const DRAFT_PREFIX = 'form-draft:'

export function useFormDraft<T extends FieldValues>(
  form: UseFormReturn<T>,
  key: string
) {
  const draftKey = `${DRAFT_PREFIX}${key}`

  useEffect(() => {
    const saved = localStorage.getItem(draftKey)
    if (!saved) return
    try {
      const parsed = JSON.parse(saved)
      Object.entries(parsed).forEach(([field, value]) => {
        form.setValue(field as Path<T>, value as T[Path<T>])
      })
    } catch { /* ignore */ }
  }, [draftKey, form])

  const saveDraft = useCallback(
    (data: Partial<T>) => {
      localStorage.setItem(draftKey, JSON.stringify(data))
    },
    [draftKey]
  )

  const clearDraft = useCallback(() => {
    localStorage.removeItem(draftKey)
  }, [draftKey])

  return { saveDraft, clearDraft }
}
