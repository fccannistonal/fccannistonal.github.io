import { siteConfig } from '../../content/churchContent';

type BrandLogoProps = {
  className?: string;
};

export function BrandLogo({ className }: BrandLogoProps) {
  return (
    <picture className={className}>
      <source srcSet="/images/brand/fcc-logo-128.avif" type="image/avif" />
      <source srcSet="/images/brand/fcc-logo-128.webp" type="image/webp" />
      <img src={siteConfig.logoSrc} alt="" width="364" height="486" />
    </picture>
  );
}
