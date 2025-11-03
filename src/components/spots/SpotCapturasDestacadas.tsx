import { Trophy } from 'lucide-react'
import { CapturaDestacadaCard } from '../capturas/CapturaDestacadaCard'
import type { Captura } from '../../modelo/Captura'

interface SpotCapturasDestacadasProps {
  capturas: Captura[]
  loading: boolean
}

export const SpotCapturasDestacadas = ({ capturas, loading }: SpotCapturasDestacadasProps) => {
  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-6">
      <h2 className="text-2xl font-bold text-card-foreground mb-6 flex items-center gap-2">
        <Trophy className="w-6 h-6 text-yellow-500" />
        Capturas Destacadas
      </h2>
      {loading ? (
        <p className="text-muted-foreground">Cargando capturas...</p>
      ) : capturas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {capturas.map((captura, index) => (
            <CapturaDestacadaCard key={captura.id} captura={captura} ranking={index + 1} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-muted-foreground">Aún no hay capturas registradas en este spot</p>
          <p className="text-sm text-muted-foreground mt-1">¡Sé el primero en registrar una!</p>
        </div>
      )}
    </div>
  )
}
