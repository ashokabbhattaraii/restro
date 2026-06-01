import Link from "next/link";
import type { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
  variant?: "primary" | "ghost" | "danger";
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
};

export default function Button({
  href,
  variant = "primary",
  className,
  children,
  onClick,
  ...props
}: ButtonProps) {
  const classes = cn("btn", `btn-${variant}`, className);

  if (href) {
    return (
      <Link className={classes} href={href} onClick={onClick as MouseEventHandler<HTMLAnchorElement>}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} type="button" onClick={onClick as MouseEventHandler<HTMLButtonElement>} {...props}>
      {children}
    </button>
  );
}
