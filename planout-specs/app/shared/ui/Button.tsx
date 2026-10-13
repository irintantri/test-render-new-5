import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Spinner } from "./Spinner";

export type ButtonVariant = "primary" | "success" | "outline" | "ghost" | "link" | "danger" | "danger-ghost" | "primary-ghost";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  block?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
}

export function Button({ variant = "primary", size = "md", block, loading, icon, iconRight, className, children, disabled, ...rest }: ButtonProps) {
  const cls = ["btn", `btn--${variant}`, size !== "md" && `btn--${size}`, block && "btn--block", className].filter(Boolean).join(" ");
  return (
    <button type="button" className={cls} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>
      {loading ? <Spinner size={14} light={variant === "primary" || variant === "success" || variant === "danger"} /> : icon}
      {children}
      {iconRight}
    </button>
  );
}
