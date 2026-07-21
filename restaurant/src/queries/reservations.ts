import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, fetcher, poster, putter, deleter } from '@/lib/api/client';
import type { Reservation } from '@/types';

const RESERVATIONS_KEY = ['reservations'] as const;

export function useReservations() {
  return useQuery({
    queryKey: RESERVATIONS_KEY,
    queryFn: () => fetcher<Reservation[]>('/api/reservations'),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
}

export function useCreateReservation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (reservation: Partial<Reservation>) => poster<Reservation>('/api/reservations', reservation),
    onSuccess: () => qc.invalidateQueries({ queryKey: RESERVATIONS_KEY }),
  });
}

export function useUpdateReservation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...reservation }: Partial<Reservation> & { id: string }) => putter<Reservation>(`/api/reservations/${id}`, reservation),
    onSuccess: () => qc.invalidateQueries({ queryKey: RESERVATIONS_KEY }),
  });
}

export function useDeleteReservation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleter(`/api/reservations/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: RESERVATIONS_KEY }),
  });
}