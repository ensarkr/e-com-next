"use client";
import { useRouter } from "next/navigation";
import styles from "./buttons.module.css";
import Link from "next/link";

// * all buttons have same style

export function ReturnButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      type="button"
      className={styles.rectButton}
    >
      return
    </button>
  );
}

export function CustomButton({
  title,
  onClick,
  type,
  disabled,
}: {
  title: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  type?: HTMLButtonElement["type"];
  disabled?: boolean | undefined;
}) {
  return (
    <button
      onClick={onClick}
      type={type === undefined ? "button" : type}
      className={styles.rectButton}
      disabled={disabled}
    >
      {title}
    </button>
  );
}

export function LinkButton({
  title,
  href,
  onClick,
  prefetch,
}: {
  title: string;
  href: string;
  onClick?: () => void;
  prefetch?: boolean;
}) {
  return (
    <Link
      className={styles.rectAnchor}
      onClick={onClick}
      href={href}
      prefetch={prefetch}
    >
      {title}
    </Link>
  );
}
