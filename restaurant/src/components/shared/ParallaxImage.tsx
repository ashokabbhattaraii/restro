"use client";

import Image from "next/image";
import { useParallax } from "@/hooks/useParallax";
import { shimmer, toBase64 } from "@/lib/utils";

export default function ParallaxImage({
  src,
  alt,
  priority = false,
  quality = 80,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  quality?: number;
}) {
  const ref = useParallax(150);

  return (
    <div
      className="parallax-image"
      ref={ref as React.RefObject<HTMLDivElement>}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        quality={quality}
        sizes="100vw"
        placeholder="blur"
        blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(1600, 900))}`}
      />
    </div>
  );
}
