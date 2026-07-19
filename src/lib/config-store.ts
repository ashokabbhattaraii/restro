import { DEFAULT_CONFIG } from "./config";
import type { RestaurantConfig, DayHours } from "./config";

let currentConfig: RestaurantConfig = { ...DEFAULT_CONFIG };

export function getConfig(): RestaurantConfig {
  return currentConfig;
}

export function updateConfig(partial: Partial<RestaurantConfig>): RestaurantConfig {
  currentConfig = { ...currentConfig, ...partial };
  return currentConfig;
}
export type { RestaurantConfig, DayHours };
