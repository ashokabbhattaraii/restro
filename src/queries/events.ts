import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, fetcher, poster, putter, deleter } from '@/lib/api/client';
import type { EventItem } from '@/types';

const EVENTS_KEY = ['events'] as const;

export function useEvents(limit?: number) {
  return useQuery({
    queryKey: [...EVENTS_KEY, { limit }],
    queryFn: () => {
      const params = new URLSearchParams();
      if (limit) params.set('limit', String(limit));
      params.set('public', 'true');
      return fetcher<EventItem[]>(`/api/events?${params}`);
    },
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
}

export function useEventsAdmin() {
  return useQuery({
    queryKey: [...EVENTS_KEY, 'admin'],
    queryFn: () => fetcher<EventItem[]>('/api/events'),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
}

export function useCreateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (event: Partial<EventItem>) => poster<EventItem>('/api/events', event),
    onSuccess: () => qc.invalidateQueries({ queryKey: EVENTS_KEY }),
  });
}

export function useUpdateEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...event }: Partial<EventItem> & { id: string }) => putter<EventItem>(`/api/events/${id}`, event),
    onSuccess: () => qc.invalidateQueries({ queryKey: EVENTS_KEY }),
  });
}

export function useDeleteEvent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleter(`/api/events/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: EVENTS_KEY }),
  });
}