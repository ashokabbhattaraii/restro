import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export default function SectionLabel({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("section-label", className)} {...props} />;
}
