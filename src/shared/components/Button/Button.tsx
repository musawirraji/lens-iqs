import type { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.scss";

type Variant = "primary" | "ghost";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({ variant = "primary", className, children, ...rest }: Props) {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${className ?? ""}`}
      {...rest}
    >
      {children}
    </button>
  );
}
