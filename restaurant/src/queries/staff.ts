import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, fetcher, poster, putter, deleter } from '@/lib/api/client';
import type { StaffMember } from '@/types';

const STAFF_KEY = ['staff'] as const;

export function useStaff(publicOnly = true) {
  return useQuery({
    queryKey: [...STAFF_KEY, { publicOnly }],
    queryFn: () => {
      const endpoint = publicOnly ? '/api/staff?public=true' : '/api/staff';
      return fetcher<StaffMember[]>(endpoint);
    },
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });
}

export function useCreateStaff() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (member: Partial<StaffMember>) => poster<StaffMember>('/api/staff', member),
    onSuccess: () => qc.invalidateQueries({ queryKey: STAFF_KEY }),
  });
}

export function useUpdateStaff() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...member }: Partial<StaffMember> & { id: string }) => putter<StaffMember>(`/api/staff/${id}`, member),
    onSuccess: () => qc.invalidateQueries({ queryKey: STAFF_KEY }),
  });
}

export function useDeleteStaff() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleter(`/api/staff/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: STAFF_KEY }),
  });
}