import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, fetcher, poster, putter, deleter } from '@/lib/api/client';
import type { OfferItem } from '@/types';

const OFFERS_KEY = ['offers'] as const;

export function useOffers() {
  return useQuery({
    queryKey: OFFERS_KEY,
    queryFn: () => fetcher<OfferItem[]>('/api/offers'),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
}

export function useActiveOffers() {
  return useQuery({
    queryKey: [...OFFERS_KEY, 'active'],
    queryFn: () => fetcher<OfferItem[]>('/api/offers?active=true'),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
}

export function useCreateOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (offer: Omit<OfferItem, 'id'>) => poster<OfferItem>('/api/offers', offer),
    onSuccess: () => qc.invalidateQueries({ queryKey: OFFERS_KEY }),
  });
}

export function useUpdateOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...offer }: Partial<OfferItem> & { id: string }) => putter<OfferItem>(`/api/offers/${id}`, offer),
    onSuccess: () => qc.invalidateQueries({ queryKey: OFFERS_KEY }),
  });
}

export function useDeleteOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleter(`/api/offers/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: OFFERS_KEY }),
  });
}