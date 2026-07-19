import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import type { MenuItem, EventItem, GalleryImage, StaffMember, Reservation, Message } from '@/types'

export function useMenuItems(featured?: boolean, category?: string) {
  return useQuery({
    queryKey: ['menu', { featured, category }],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (featured) params.set('featured', 'true')
      if (category) params.set('category', category)
      const { data } = await api.get<MenuItem[]>(`/api/menu/public?${params}`)
      return data
    },
  })
}

export function useMenuItemsAdmin() {
  return useQuery({
    queryKey: ['menu', 'admin'],
    queryFn: async () => {
      const { data } = await api.get<MenuItem[]>('/api/menu')
      return data
    },
  })
}

export function useCreateMenuItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (item: Partial<MenuItem>) => {
      const { data } = await api.post('/api/menu', item)
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['menu'] }),
  })
}

export function useUpdateMenuItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...item }: Partial<MenuItem> & { id: string }) => {
      const { data } = await api.put(`/api/menu/${id}`, item)
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['menu'] }),
  })
}

export function useBulkCreateMenuItems() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (items: Partial<MenuItem>[]) => {
      const { data } = await api.post('/api/menu/bulk', items)
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['menu'] }),
  })
}

export function useDeleteMenuItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/menu/${id}`)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['menu'] }),
  })
}

export function useEvents(limit?: number) {
  return useQuery({
    queryKey: ['events', { limit }],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (limit) params.set('limit', String(limit))
      const { data } = await api.get<EventItem[]>(`/api/events/public?${params}`)
      return data
    },
  })
}

export function useEventsAdmin() {
  return useQuery({
    queryKey: ['events', 'admin'],
    queryFn: async () => {
      const { data } = await api.get<EventItem[]>('/api/events')
      return data
    },
  })
}

export function useCreateEvent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (event: Partial<EventItem>) => {
      const { data } = await api.post('/api/events', event)
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['events'] }),
  })
}

export function useUpdateEvent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...event }: Partial<EventItem> & { id: string }) => {
      const { data } = await api.put(`/api/events/${id}`, event)
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['events'] }),
  })
}

export function useDeleteEvent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/events/${id}`)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['events'] }),
  })
}

export function useGalleryImages(category?: string) {
  return useQuery({
    queryKey: ['gallery', { category }],
    queryFn: async () => {
      const params = category ? `?category=${category}` : ''
      const { data } = await api.get<GalleryImage[]>(`/api/gallery${params}`)
      return data
    },
  })
}

export function useCreateGalleryImage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (image: Partial<GalleryImage>) => {
      const { data } = await api.post('/api/gallery', image)
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['gallery'] }),
  })
}

export function useDeleteGalleryImage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/gallery/${id}`)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['gallery'] }),
  })
}

export function useStaff(publicOnly = true) {
  return useQuery({
    queryKey: ['staff', { publicOnly }],
    queryFn: async () => {
      const endpoint = publicOnly ? '/api/staff/public' : '/api/staff'
      const { data } = await api.get<StaffMember[]>(endpoint)
      return data
    },
  })
}

export function useCreateStaff() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (member: Partial<StaffMember>) => {
      const { data } = await api.post('/api/staff', member)
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['staff'] }),
  })
}

export function useUpdateStaff() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...member }: Partial<StaffMember> & { id: string }) => {
      const { data } = await api.put(`/api/staff/${id}`, member)
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['staff'] }),
  })
}

export function useDeleteStaff() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/staff/${id}`)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['staff'] }),
  })
}

export function useReservations() {
  return useQuery({
    queryKey: ['reservations'],
    queryFn: async () => {
      const { data } = await api.get<Reservation[]>('/api/reservations')
      return data
    },
  })
}

export function useCreateReservation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (reservation: Partial<Reservation>) => {
      const { data } = await api.post('/api/reservations', reservation)
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reservations'] }),
  })
}

export function useUpdateReservation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...reservation }: Partial<Reservation> & { id: string }) => {
      const { data } = await api.put(`/api/reservations/${id}`, reservation)
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reservations'] }),
  })
}

export function useDeleteReservation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/reservations/${id}`)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reservations'] }),
  })
}

export function useMessages() {
  return useQuery({
    queryKey: ['messages'],
    queryFn: async () => {
      const { data } = await api.get<Message[]>('/api/messages')
      return data
    },
  })
}

export function useCreateMessage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (message: Partial<Message>) => {
      const { data } = await api.post('/api/messages', message)
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['messages'] }),
  })
}

export function useUpdateMessage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...message }: Partial<Message> & { id: string }) => {
      const { data } = await api.put(`/api/messages/${id}`, message)
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['messages'] }),
  })
}

export function useDeleteMessage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/messages/${id}`)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['messages'] }),
  })
}
