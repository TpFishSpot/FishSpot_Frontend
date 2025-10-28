import { Target } from 'lucide-react'

interface TipoPesca {
  nombre: string
  cantidad: number
}

interface SpotTiposPescaProps {
  tiposPesca: TipoPesca[]
  totalCapturas: number
  loading: boolean
}

export const SpotTiposPesca = ({ tiposPesca, totalCapturas, loading }: SpotTiposPescaProps) => {
  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-6">
      <h2 className="text-2xl font-bold text-card-foreground mb-6 flex items-center gap-2">
        <Target className="w-6 h-6 text-primary" />
        Tipos de Pesca Más Usados
      </h2>
      {loading ? (
        <p className="text-muted-foreground">Cargando estadísticas...</p>
      ) : tiposPesca && tiposPesca.length > 0 ? (
        <div className="space-y-3">
          {tiposPesca.slice(0, 3).map((tipo, index) => {
            const porcentaje = ((tipo.cantidad / totalCapturas) * 100).toFixed(1)
            
            return (
              <div
                key={tipo.nombre}
                className="bg-gradient-to-r from-primary/5 to-transparent border border-border rounded-lg p-4 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-primary">#{index + 1}</span>
                    <h3 className="font-bold text-card-foreground text-lg">{tipo.nombre}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {tipo.cantidad} {tipo.cantidad === 1 ? 'captura' : 'capturas'}
                    </p>
                    <p className="text-xs text-primary font-semibold">{porcentaje}%</p>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary rounded-full h-2 transition-all duration-500" 
                    style={{ width: `${porcentaje}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <p className="text-muted-foreground italic">
          Aún no hay capturas registradas para mostrar estadísticas de tipos de pesca.
        </p>
      )}
    </div>
  )
}
