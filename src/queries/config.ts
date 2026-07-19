import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, fetcher, putter } from '@/lib/api/client';
import type { RestaurantConfig } from '@/lib/config';

const CONFIG_KEY = ['config'] as const;

export function useConfig() {
  return useQuery({
    queryKey: CONFIG_KEY,
    queryFn: () => fetcher<RestaurantConfig>('/api/config'),
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
}

export function useUpdateConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (config: Partial<RestaurantConfig>) => putter<RestaurantConfig>('/api/config', config),
    onSuccess: () => qc.invalidateQueries({ queryKey: CONFIG_KEY }),
  });
}