"use client";

import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/api/client";
import type { RestaurantConfig } from "@/lib/config";
import { DEFAULT_CONFIG } from "@/lib/config";

export function useConfig() {
  const { data, isLoading } = useQuery({
    queryKey: ["config"],
    queryFn: () => fetcher<RestaurantConfig>("/api/config"),
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 1,
  });

  return { config: data ?? DEFAULT_CONFIG, loading: isLoading };
}