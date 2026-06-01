import OptimizedImage from "@/components/shared/OptimizedImage";

export default function FoodImage({
  src,
  alt,
  priority = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  return (
    <div className="image-pop food-image">
      <OptimizedImage src={src} alt={alt} priority={priority} quality={priority ? 90 : 80} />
      <span className="image-gold-overlay" />
    </div>
  );
}
