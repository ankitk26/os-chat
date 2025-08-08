import type { ComponentProps, ReactNode } from "react";

type Props = ComponentProps<"a"> & {
  children: ReactNode;
  href: string;
};

export default function CustomExternalLink({
  children,
  href,
  ...props
}: Props) {
  return (
    <a href={href} rel="noopener noreferrer" target="_blank" {...props}>
      {children}
    </a>
  );
}
