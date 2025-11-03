import { Calendar, Weight, Ruler, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Captura } from '../../modelo/Captura'

interface CapturaDestacadaCardProps {
  captura: Captura
  ranking: number
}

const buildImageUrl = (path: string | undefined): string => {
  if (!path) return ''
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
  return path.startsWith('http') ? path : `${baseUrl}/${path}`
}

const getMedalla = (ranking: number) => {
  switch (ranking) {
    case 1: return { emoji: '🥇', color: 'from-yellow-400 to-yellow-600', text: '1º Lugar' }
    case 2: return { emoji: '🥈', color: 'from-gray-300 to-gray-500', text: '2º Lugar' }
    case 3: return { emoji: '🥉', color: 'from-orange-400 to-orange-600', text: '3º Lugar' }
    default: return { emoji: '🏅', color: 'from-blue-400 to-blue-600', text: `${ranking}º` }
  }
}

const obtenerNombreEspecie = (captura: Captura) =>
  captura.especie?.nombresComunes?.[0]?.nombre ||
  captura.especie?.nombreCientifico ||
  'Especie desconocida'

export const CapturaDestacadaCard = ({ captura, ranking }: CapturaDestacadaCardProps) => {
  const medalla = getMedalla(ranking)
  const nombreUsuario = (captura as any).usuario?.nombre || 'Pescador anónimo'
  const fotoUsuario = (captura as any).usuario?.fotoPerfil
  const navigate = useNavigate()

  return (
    <div 
      onClick={() => navigate(`/capturas/${captura.id}`)}
      className="bg-card border border-border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all cursor-pointer"
    >
      <div className="relative">
        <div className={`absolute top-2 left-2 z-10 bg-gradient-to-br ${medalla.color} text-white px-3 py-1 rounded-full flex items-center gap-1 shadow-lg`}>
          <span className="text-lg">{medalla.emoji}</span>
          <span className="text-xs font-bold">{medalla.text}</span>
        </div>
        
        <div className="relative h-40 bg-muted">
          {captura.foto ? (
            <img
              src={buildImageUrl(captura.foto)}
              alt={obtenerNombreEspecie(captura)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Weight className="w-12 h-12 text-muted-foreground" />
            </div>
          )}
        </div>
      </div>

      <div className="p-3">
        <h4 className="font-bold text-foreground mb-2 truncate">{obtenerNombreEspecie(captura)}</h4>
        
        <div className="space-y-1.5 text-sm">
          {captura.peso && (
            <div className="flex items-center gap-2 text-primary">
              <Weight className="w-4 h-4 flex-shrink-0" />
              <span className="font-semibold">{captura.peso} kg</span>
            </div>
          )}
          
          {captura.tamanio && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Ruler className="w-4 h-4 flex-shrink-0" />
              <span>{captura.tamanio} cm</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-muted-foreground pt-1 border-t border-border">
            {fotoUsuario ? (
              <img src={buildImageUrl(fotoUsuario)} alt={nombreUsuario} className="w-5 h-5 rounded-full" />
            ) : (
              <User className="w-4 h-4 flex-shrink-0" />
            )}
            <span className="truncate text-xs">{nombreUsuario}</span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{new Date(captura.fecha).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
