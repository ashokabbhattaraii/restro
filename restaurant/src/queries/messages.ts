import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, fetcher, poster, putter, deleter } from '@/lib/api/client';
import type { Message, VerifiedFeedback } from '@/types';

const MESSAGES_KEY = ['messages'] as const;

export function useMessages() {
  return useQuery({
    queryKey: MESSAGES_KEY,
    queryFn: () => fetcher<Message[]>('/api/messages'),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
}

export function useCreateMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (message: Partial<Message>) => poster<Message>('/api/messages', message),
    onSuccess: () => qc.invalidateQueries({ queryKey: MESSAGES_KEY }),
  });
}

export function useUpdateMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...message }: Partial<Message> & { id: string }) => putter<Message>(`/api/messages/${id}`, message),
    onSuccess: () => qc.invalidateQueries({ queryKey: MESSAGES_KEY }),
  });
}

export function useDeleteMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleter(`/api/messages/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: MESSAGES_KEY }),
  });
}

export function useAdminMessages(filters?: { verified?: boolean; contactType?: Message['contactType']; read?: boolean }) {
  const queryKey = [...MESSAGES_KEY, 'admin', filters];
  return useQuery({
    queryKey,
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.verified !== undefined) params.set('verified', String(filters.verified));
      if (filters?.contactType) params.set('contactType', filters.contactType);
      if (filters?.read !== undefined) params.set('read', String(filters.read));
      return fetcher<Message[]>(`/api/messages?${params}`);
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
}

export function useVerifiedFeedback() {
  return useQuery({
    queryKey: [...MESSAGES_KEY, 'verified', 'feedback'],
    queryFn: async () => {
      const data = await fetcher<Array<Partial<VerifiedFeedback> & Partial<Message>>>(
        '/api/messages?verified=true&contactType=feedback'
      );
      return (data ?? [])
        .map((m): VerifiedFeedback => ({
          id: m.id ?? m._id ?? '',
          name: m.name ?? 'Guest',
          location: m.location ?? 'Guest',
          quote: (m.quote ?? m.message ?? '').trim(),
          rating: typeof m.rating === 'number' && m.rating > 0 && m.rating <= 5 ? m.rating : 5,
          createdAt: m.createdAt ?? '',
        }))
        .filter((f) => f.quote.length > 0);
    },
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
}