import React, { useState, useEffect } from 'react'
import { Fish, Info } from 'lucide-react'
import NavigationBar from '../common/NavigationBar'
import apiFishSpot from '../../api/apiFishSpot'

interface Carnada {
  idCarnada: string
  nombre: string
  descripcion?: string
  tipo?: string
  efectividad?: string
}

const ListaCarnadas: React.FC = () => {
  const [carnadas, setCarnadas] = useState<Carnada[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCarnadas = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await apiFishSpot.get('/carnada')
        setCarnadas(response.data)
      } catch (err) {
        setError('Error al cargar las carnadas')
      } finally {
        setLoading(false)
      }
    }

    fetchCarnadas()
  }, [])

  if (loading) {
    return (
      <>
        <NavigationBar />
        <div className="min-h-screen bg-background pt-16 px-4">
          <div className="max-w-4xl mx-auto py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-1/3 mb-6"></div>
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-24 bg-muted rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <NavigationBar />
        <div className="min-h-screen bg-background pt-16 px-4">
          <div className="max-w-4xl mx-auto py-8">
            <div className="text-center">
              <p className="text-destructive">{error}</p>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <NavigationBar />
      <div className="min-h-screen bg-background pt-16 px-4">
        <div className="max-w-4xl mx-auto py-8">
          <div className="flex items-center gap-3 mb-8">
            <Fish className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Guía de Carnadas</h1>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {carnadas.map((carnada) => (
              <div key={carnada.idCarnada} className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <Fish className="w-5 h-5 text-secondary flex-shrink-0" />
                  <h3 className="font-semibold text-card-foreground text-lg">{carnada.nombre}</h3>
                </div>
                
                {carnada.descripcion && (
                  <div className="mb-3">
                    <p className="text-muted-foreground text-sm">{carnada.descripcion}</p>
                  </div>
                )}

                {carnada.tipo && (
                  <div className="mb-2">
                    <span className="inline-block bg-primary/10 text-primary px-2 py-1 rounded-md text-xs font-medium">
                      {carnada.tipo}
                    </span>
                  </div>
                )}

                {carnada.efectividad && (
                  <div className="flex items-center gap-2 text-sm">
                    <Info className="w-4 h-4 text-accent" />
                    <span className="text-muted-foreground">Efectividad: {carnada.efectividad}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {carnadas.length === 0 && (
            <div className="text-center py-12">
              <Fish className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium text-muted-foreground mb-2">No hay carnadas disponibles</h3>
              <p className="text-muted-foreground">Las carnadas aparecerán aquí cuando estén disponibles.</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ListaCarnadas
