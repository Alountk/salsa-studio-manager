import Link from "next/link";
import type { AnchorHTMLAttributes } from "react";
import { buttonClasses } from "./button-classes";
import type { ButtonSize, ButtonVariant } from "./button";
import { Icon } from "./icon";

/**
 * A navigation action that looks like a button.
 *
 * Use this instead of `<Link><Button /></Link>`: that nests a `<button>` inside
 * an `<a>`, which is invalid HTML and leaves assistive technology unsure which
 * element is the link. Here the anchor *is* the button, so there is one focusable
 * element and one target.
 */
export function LinkButton({
  href,
  variant,
  size,
  icon,
  fullWidth,
  className,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: string;
  fullWidth?: boolean;
}) {
  return (
    <Link href={href} className={buttonClasses({ variant, size, fullWidth, className })} {...props}>
      {icon ? <Icon name={icon} className="text-[1.125rem]" /> : null}
      {children}
    </Link>
  );
}
