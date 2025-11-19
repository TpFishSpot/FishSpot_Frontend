import { useState } from 'react'
import { ImageIcon } from 'lucide-react'
import { baseApi } from '../../api/apiFishSpot'

interface ImagenResponsiveProps {
  src: string | undefined
  alt: string
  className?: string
  aspectRatio?: 'square' | 'landscape' | 'portrait' | 'auto'
  objectFit?: 'cover' | 'contain' | 'fill'
  onClick?: () => void
}

const buildImageUrl = (path: string | undefined): string => {
  if (!path) return ''
  return path.startsWith('http') ? path : `${baseApi}/${path.startsWith("/") ? path.slice(1) : path}`
}

const aspectRatioClasses = {
  square: 'aspect-square',
  landscape: 'aspect-video',
  portrait: 'aspect-[3/4]',
  auto: ''
}

/**
 * Componente optimizado para mostrar imágenes de forma responsiva
 * Maneja automáticamente URLs, errores y estados de carga
 * 
 * @param src - Ruta de la imagen (puede ser relativa o absoluta)
 * @param alt - Texto alternativo
 * @param className - Clases CSS adicionales para el contenedor
 * @param aspectRatio - Relación de aspecto: 'square' | 'landscape' | 'portrait' | 'auto'
 * @param objectFit - Modo de ajuste: 'cover' (recorta) | 'contain' (completa) | 'fill' (estira)
 * @param onClick - Función a ejecutar al hacer click
 */
export const ImagenResponsive = ({ 
  src, 
  alt, 
  className = '', 
  aspectRatio = 'landscape',
  objectFit = 'contain',
  onClick 
}: ImagenResponsiveProps) => {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  const imageUrl = buildImageUrl(src)
  const hasImage = imageUrl && !error

  const objectFitClass = objectFit === 'cover' ? 'object-cover' : objectFit === 'contain' ? 'object-contain' : 'object-fill'
  const aspectClass = aspectRatioClasses[aspectRatio]

  return (
    <div 
      className={`relative overflow-hidden bg-muted flex items-center justify-center ${aspectClass} ${className}`}
      onClick={onClick}
    >
      {hasImage ? (
        <>
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
          <img
            src={imageUrl}
            alt={alt}
            className={`w-full h-full ${objectFitClass} ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
            onLoad={() => setLoading(false)}
            onError={() => {
              setError(true)
              setLoading(false)
            }}
          />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center text-muted-foreground p-4">
          <ImageIcon className="w-12 h-12 mb-2" />
          <span className="text-xs text-center">Sin imagen</span>
        </div>
      )}
    </div>
  )
}
