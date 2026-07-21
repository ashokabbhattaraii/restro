"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { poster } from "@/lib/api/client";
import type { RestaurantConfig } from "@/lib/config";

export function useUpdateConfig() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (partial: Partial<RestaurantConfig>) => poster<RestaurantConfig>("/api/config", partial),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["config"] }),
  });
}