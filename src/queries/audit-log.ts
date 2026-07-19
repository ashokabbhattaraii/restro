import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetcher, poster } from '@/lib/api/client';
import type { AuditLogEntry } from '@/types';

const AUDIT_LOG_KEY = ['audit-log'] as const;

export function useAuditLog(params: {
  search?: string;
  action?: string;
  resource?: string;
  limit?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: [...AUDIT_LOG_KEY, params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.search) searchParams.set('search', params.search);
      if (params.action && params.action !== 'all') searchParams.set('action', params.action);
      if (params.resource && params.resource !== 'all') searchParams.set('resource', params.resource);
      if (params.limit) searchParams.set('limit', String(params.limit));
      if (params.offset) searchParams.set('offset', String(params.offset));
      return fetcher<{ entries: AuditLogEntry[]; total: number }>(`/api/audit-log?${searchParams}`);
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
}

export function useAuditLogEntry(id: string) {
  return useQuery({
    queryKey: [...AUDIT_LOG_KEY, 'entry', id],
    queryFn: () => fetcher<AuditLogEntry>(`/api/audit-log/${id}`),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
}