import Image from "next/image";
import { shimmer, toBase64 } from "@/lib/utils";

export default function OptimizedImage({
  src,
  alt,
  quality = 80,
  priority = false,
  className,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: {
  src: string;
  alt: string;
  quality?: number;
  priority?: boolean;
  className?: string;
  sizes?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      quality={quality}
      priority={priority}
      className={className}
      style={{ objectFit: "cover" }}
      placeholder="blur"
      blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(1000, 750))}`}
    />
  );
}
