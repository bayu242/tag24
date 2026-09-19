import type { ReactNode } from "react";

type Variant = "primary" | "accent" | "secondary" | "ghost";
type Size = "md" | "lg";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors duration-200 ease-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const VARIANT: Record<Variant, string> = {
  primary: "bg-primary text-on-primary hover:bg-primary-strong",
  accent: "bg-accent text-on-primary hover:bg-accent-strong",
  secondary: "border border-line bg-background text-ink hover:border-accent hover:text-accent",
  ghost: "text-accent hover:bg-accent-soft",
};

const SIZE: Record<Size, string> = {
  md: "h-11 px-5 text-[15px]",
  lg: "h-14 px-7 text-base",
};

type ButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  external?: boolean;
  className?: string;
};

export function Button({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  icon,
  external = false,
  className = "",
}: ButtonProps) {
  const classes = `${BASE} ${VARIANT[variant]} ${SIZE[size]} ${className}`;
  const content = (
    <>
      {icon}
      <span>{children}</span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        onClick={onClick}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      >
        {content}
      </a>
    );
  }

  return (
    <button type="button" className={classes} onClick={onClick}>
      {content}
    </button>
  );
}
