import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export default function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("field", className)} {...props} />;
}
