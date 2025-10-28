import { Fish, TrendingUp, Sunrise, Sun, Sunset, Moon, Wind, CloudRain, CloudSun, Weight, Ruler } from 'lucide-react'
import { useEstadisticasSpot } from '../../hooks/capturas/useEstadisticasSpot'
import type { EspecieDetalle } from '../../hooks/capturas/useEstadisticasSpot'

interface EstadisticasSpotProps {
  spotId: string
}

const buildImageUrl = (path: string | undefined | null): string => {
  if (!path) return ''
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
  return path.startsWith('http') ? path : `${baseUrl}/${path}`
}

const getHorarioIcon = (franja: string) => {
  switch (franja) {
    case 'madrugada': return <Moon className="w-5 h-5" />
    case 'mañana': return <Sunrise className="w-5 h-5" />
    case 'tarde': return <Sun className="w-5 h-5" />
    case 'noche': return <Sunset className="w-5 h-5" />
    default: return null
  }
}

const getClimaIcon = (clima: string) => {
  const climaLower = clima.toLowerCase()
  if (climaLower.includes('sol')) return <CloudSun className="w-4 h-4" />
  if (climaLower.includes('lluv') || climaLower.includes('tormenta')) return <CloudRain className="w-4 h-4" />
  if (climaLower.includes('viento')) return <Wind className="w-4 h-4" />
  return <CloudSun className="w-4 h-4" />
}

const EspecieCard = ({ especie }: { especie: EspecieDetalle }) => {
  const nombreEspecie = especie.nombresComunes[0] || especie.nombreCientifico

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-3">
        {especie.imagen ? (
          <img
            src={buildImageUrl(especie.imagen)}
            alt={nombreEspecie}
            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
            <Fish className="w-8 h-8 text-muted-foreground" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground truncate">{nombreEspecie}</h4>
          <p className="text-xs text-muted-foreground italic truncate">{especie.nombreCientifico}</p>
          
          <div className="mt-2 flex items-center gap-3 text-xs">
            <span className="text-primary font-semibold">{especie.totalCapturas} capturas</span>
            {especie.pesoPromedio && (
              <span className="text-muted-foreground flex items-center gap-1">
                <Weight className="w-3 h-3" />
                {especie.pesoPromedio}kg
              </span>
            )}
            {especie.tamanioPromedio && (
              <span className="text-muted-foreground flex items-center gap-1">
                <Ruler className="w-3 h-3" />
                {especie.tamanioPromedio}cm
              </span>
            )}
          </div>
        </div>
      </div>

      {(especie.pesoMaximo || especie.tamanioMaximo) && (
        <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
          <div className="flex gap-4">
            {especie.pesoMaximo && (
              <span>Peso máx: <strong>{especie.pesoMaximo}kg</strong></span>
            )}
            {especie.tamanioMaximo && (
              <span>Tamaño máx: <strong>{especie.tamanioMaximo}cm</strong></span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export const EstadisticasSpot = ({ spotId }: EstadisticasSpotProps) => {
  const { estadisticas, loading, error } = useEstadisticasSpot(spotId)

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-muted-foreground">Cargando estadísticas...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
        <p className="text-destructive text-sm">{error}</p>
      </div>
    )
  }

  if (!estadisticas || estadisticas.estadisticas.totalCapturas === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <Fish className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">Aún no hay capturas registradas en este spot</p>
      </div>
    )
  }

  const { estadisticas: stats } = estadisticas
  const totalHorarios = stats.mejoresHorarios.madrugada + stats.mejoresHorarios.mañana + 
                        stats.mejoresHorarios.tarde + stats.mejoresHorarios.noche

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-lg p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs opacity-90">Total Capturas</p>
              <p className="text-2xl font-bold">{stats.totalCapturas}</p>
            </div>
            <TrendingUp className="w-8 h-8 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs opacity-90">Especies Únicas</p>
              <p className="text-2xl font-bold">{stats.especiesUnicas}</p>
            </div>
            <Fish className="w-8 h-8 opacity-80" />
          </div>
        </div>

        {stats.especiesDetalle[0] && (
          <div className="col-span-2 bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-lg p-4 shadow-md">
            <p className="text-xs opacity-90 mb-1">Especie más capturada</p>
            <p className="font-bold truncate">{stats.especiesDetalle[0].nombresComunes[0] || stats.especiesDetalle[0].nombreCientifico}</p>
            <p className="text-sm opacity-90">{stats.especiesDetalle[0].totalCapturas} capturas</p>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <Fish className="w-5 h-5 text-primary" />
          Especies Capturadas
        </h3>
        <div className="grid gap-3 md:grid-cols-2">
          {stats.especiesDetalle.map((especie) => (
            <EspecieCard key={especie.especieId} especie={especie} />
          ))}
        </div>
      </div>

      {totalHorarios > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Mejores Horarios</h3>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(stats.mejoresHorarios).map(([franja, cantidad]) => {
                if (cantidad === 0) return null
                const porcentaje = totalHorarios > 0 ? (cantidad / totalHorarios) * 100 : 0
                
                return (
                  <div key={franja} className="text-center">
                    <div className="flex justify-center mb-2 text-primary">
                      {getHorarioIcon(franja)}
                    </div>
                    <p className="text-xs text-muted-foreground capitalize mb-1">{franja}</p>
                    <p className="text-lg font-bold text-foreground">{cantidad}</p>
                    <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${porcentaje}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {stats.carnadasMasUsadas.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Carnadas Más Usadas</h3>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex flex-wrap gap-2">
              {stats.carnadasMasUsadas.map((carnada, index) => (
                <div 
                  key={index}
                  className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm"
                >
                  <span className="font-medium">{carnada.nombre}</span>
                  <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded-full text-xs font-bold">
                    {carnada.cantidad}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {Object.keys(stats.climasRegistrados).length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Condiciones Climáticas</h3>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex flex-wrap gap-2">
              {Object.entries(stats.climasRegistrados).map(([clima, cantidad]) => (
                <div 
                  key={clima}
                  className="inline-flex items-center gap-2 bg-muted px-3 py-2 rounded-lg text-sm"
                >
                  {getClimaIcon(clima)}
                  <span className="text-foreground">{clima}</span>
                  <span className="text-muted-foreground">({cantidad})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
