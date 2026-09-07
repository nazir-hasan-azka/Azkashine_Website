import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Standard image frame. Clips the image so it can zoom on hover without the frame
 * moving, and holds a fixed aspect ratio so nothing shifts while loading.
 *
 * `name` refers to a file in /public/img — pass "telecom" for telecom.webp, and set
 * `card` for the smaller 800x600 crop.
 */
export function Media({
  name,
  alt,
  card = false,
  ratio = "16/9",
  className,
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
}: {
  name: string;
  alt: string;
  card?: boolean;
  ratio?: "16/9" | "4/3" | "3/2";
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const ratios = { "16/9": "aspect-[16/9]", "4/3": "aspect-[4/3]", "3/2": "aspect-[3/2]" };
  return (
    <div
      className={cn(
        "zoom-frame relative w-full overflow-hidden rounded-[16px] bg-surface",
        ratios[ratio],
        className,
      )}
    >
      <Image
        src={`/img/${name}${card ? "-card" : ""}.webp`}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="zoom-target object-cover"
      />
    </div>
  );
}
