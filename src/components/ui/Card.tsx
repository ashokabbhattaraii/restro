import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export default function Card({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <article className={cn("glass-panel", className)} {...props} />;
}
