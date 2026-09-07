import { cn } from "@/lib/utils";

/**
 * Centered max-width wrapper with the site's horizontal gutters.
 * The design lays content within ~1520px of the 1920px frame.
 */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("w-full page-gutter", className)}>
      {children}
    </div>
  );
}
