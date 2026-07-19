import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, fetcher, poster, putter, deleter } from '@/lib/api/client';
import type { GalleryImage } from '@/types';

const GALLERY_KEY = ['gallery'] as const;

export function useGalleryImages(category?: string) {
  return useQuery({
    queryKey: [...GALLERY_KEY, { category }],
    queryFn: () => {
      const params = category ? `?category=${category}` : '';
      return fetcher<GalleryImage[]>(`/api/gallery${params}`);
    },
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
}

export function useCreateGalleryImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (image: Partial<GalleryImage>) => poster<GalleryImage>('/api/gallery', image),
    onSuccess: () => qc.invalidateQueries({ queryKey: GALLERY_KEY }),
  });
}

export function useDeleteGalleryImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleter(`/api/gallery/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: GALLERY_KEY }),
  });
}