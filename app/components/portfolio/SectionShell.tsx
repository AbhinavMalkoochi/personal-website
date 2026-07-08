import { type ReactNode } from "react";

interface SectionShellProps {
  id?: string;
  label?: string;
  titleId: string;
  className: string;
  children: ReactNode;
}

export function SectionShell({
  id,
  label,
  titleId,
  className,
  children,
}: SectionShellProps) {
  return (
    <section id={id} className={`section-shell ${className}`} aria-labelledby={titleId}>
      {label ? (
        <div className="section-index" aria-hidden="true">
          {label}
        </div>
      ) : null}
      {children}
    </section>
  );
}
