import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export default function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn("field", className)} {...props} />;
}
