import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, fetcher, poster, putter, deleter } from '@/lib/api/client';
import type { MenuItem } from '@/types';

const MENU_KEY = ['menu'] as const;

export function useMenuItems(featured?: boolean, category?: string) {
  return useQuery({
    queryKey: [...MENU_KEY, { featured, category }],
    queryFn: () => {
      const params = new URLSearchParams();
      if (featured) params.set('featured', 'true');
      if (category) params.set('category', category);
      return fetcher<MenuItem[]>(`/api/menu?${params}`);
    },
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
}

export function useMenuItemsAdmin() {
  return useQuery({
    queryKey: [...MENU_KEY, 'admin'],
    queryFn: () => fetcher<MenuItem[]>('/api/menu'),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
}

export function useCreateMenuItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (item: Partial<MenuItem>) => poster<MenuItem>('/api/menu', item),
    onSuccess: () => qc.invalidateQueries({ queryKey: MENU_KEY }),
  });
}

export function useUpdateMenuItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...item }: Partial<MenuItem> & { id: string }) => putter<MenuItem>(`/api/menu/${id}`, item),
    onSuccess: () => qc.invalidateQueries({ queryKey: MENU_KEY }),
  });
}

export function useBulkCreateMenuItems() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (items: Partial<MenuItem>[]) => poster<MenuItem[]>('/api/menu/bulk', items),
    onSuccess: () => qc.invalidateQueries({ queryKey: MENU_KEY }),
  });
}

export function useDeleteMenuItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleter(`/api/menu/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: MENU_KEY }),
  });
}