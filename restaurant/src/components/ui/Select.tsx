import type { SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export default function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn("field", className)} {...props} />;
}
