import React, { memo } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
}

export const LazyImage = memo(({ src, alt, className, placeholder }: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const imgRef = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const image = new Image();
          image.onload = () => {
            setIsLoaded(true);
            if (img) img.src = src;
          };
          image.onerror = () => setIsError(true);
          image.src = src;
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(img);
    return () => observer.disconnect();
  }, [src]);

  if (isError) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-500 text-sm">Error al cargar</span>
      </div>
    );
  }

  return (
    <div className="relative">
      {!isLoaded && (
        <div className={`bg-gray-200 animate-pulse ${className}`}>
          {placeholder && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-gray-400">{placeholder}</span>
            </div>
          )}
        </div>
      )}
      <img
        ref={imgRef}
        alt={alt}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        style={{ display: isLoaded ? 'block' : 'none' }}
      />
    </div>
  );
});