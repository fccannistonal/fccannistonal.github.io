type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes?: string;
  loading?: 'eager' | 'lazy';
  decoding?: 'async' | 'sync' | 'auto';
  fetchPriority?: 'high' | 'low' | 'auto';
  className?: string;
  imageClassName?: string;
  style?: React.CSSProperties;
  onError?: () => void;
};

const RESPONSIVE_WIDTHS = [480, 768, 1200, 1600];

function getWidths(sourceWidth: number) {
  const widths = RESPONSIVE_WIDTHS.filter((width) => width < sourceWidth);
  widths.push(Math.min(sourceWidth, 1600));
  return [...new Set(widths)].sort((a, b) => a - b);
}

function getVariantPath(src: string, width: number, format: 'avif' | 'webp') {
  const extensionIndex = src.lastIndexOf('.');
  const base = extensionIndex >= 0 ? src.slice(0, extensionIndex) : src;
  return `${base}-${width}.${format}`;
}

export function ResponsiveImage({
  src,
  alt,
  width,
  height,
  sizes = '100vw',
  loading = 'lazy',
  decoding = 'async',
  fetchPriority = 'auto',
  className,
  imageClassName,
  style,
  onError,
}: Props) {
  const widths = getWidths(width);
  const avifSrcSet = widths.map(
    (candidate) => `${getVariantPath(src, candidate, 'avif')} ${candidate}w`
  );
  const webpSrcSet = widths.map(
    (candidate) => `${getVariantPath(src, candidate, 'webp')} ${candidate}w`
  );

  return (
    <picture className={className}>
      <source type="image/avif" srcSet={avifSrcSet.join(', ')} sizes={sizes} />
      <source type="image/webp" srcSet={webpSrcSet.join(', ')} sizes={sizes} />
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
        className={imageClassName}
        style={style}
        onError={onError}
      />
    </picture>
  );
}
