import { memo, useCallback } from 'react';
import { LazyImage } from './LazyImage';
import { LoadingSkeleton } from './LoadingSkeleton';
import type { Spot } from '../types/api';

interface SpotCardProps {
  spot: Spot;
  onClick?: (spot: Spot) => void;
  className?: string;
}

export const SpotCard = memo(({ spot, onClick, className = '' }: SpotCardProps) => {
  const handleClick = useCallback(() => {
    onClick?.(spot);
  }, [onClick, spot]);

  const imageUrl = spot.imagenPortada 
    ? `${import.meta.env.BASE_URL}/uploads/${spot.imagenPortada}`
    : '/images/placeholder-spot.jpg';

  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer ${className}`}
      onClick={handleClick}
    >
      <LazyImage
        src={imageUrl}
        alt={spot.nombre}
        className="w-full h-48 object-cover"
        placeholder="🎣"
      />
      
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-1">
          {spot.nombre}
        </h3>
        
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
          {spot.descripcion}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center">
            📍 {spot.ubicacion}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            spot.estado === 'activo' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {spot.estado}
          </span>
        </div>
      </div>
    </div>
  );
});

interface SpotListProps {
  spots: Spot[];
  isLoading?: boolean;
  onSpotClick?: (spot: Spot) => void;
  className?: string;
}

export const SpotList = memo(({ spots, isLoading, onSpotClick, className = '' }: SpotListProps) => {
  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {Array.from({ length: 6 }).map((_, i) => (
          <LoadingSkeleton key={i} variant="card" />
        ))}
      </div>
    );
  }

  if (!spots.length) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎣</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No se encontraron spots
        </h3>
        <p className="text-gray-500">
          Intenta ajustar los filtros o buscar con otros términos
        </p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {spots.map((spot) => (
        <SpotCard
          key={spot.id}
          spot={spot}
          onClick={onSpotClick}
        />
      ))}
    </div>
  );
});