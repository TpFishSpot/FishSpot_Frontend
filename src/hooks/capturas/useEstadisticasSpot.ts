import { useState, useEffect } from 'react'
import { obtenerEstadisticasSpot } from '../../api/capturasApi'

export interface EspecieDetalle {
  especieId: string
  nombreCientifico: string
  nombresComunes: string[]
  imagen: string | null
  totalCapturas: number
  pesoPromedio: string | null
  pesoMaximo: string | null
  tamanioPromedio: string | null
  tamanioMaximo: string | null
}

export interface EstadisticasSpot {
  spotId: string
  spotNombre: string
  estadisticas: {
    totalCapturas: number
    especiesUnicas: number
    especiesDetalle: EspecieDetalle[]
    capturasPorMes: Record<string, number>
    carnadasMasUsadas: Array<{ nombre: string; cantidad: number }>
    tiposPescaMasUsados: Array<{ nombre: string; cantidad: number }>
    mejoresHorarios: {
      madrugada: number
      mañana: number
      tarde: number
      noche: number
    }
    climasRegistrados: Record<string, number>
  }
}

export const useEstadisticasSpot = (spotId: string | undefined) => {
  const [estadisticas, setEstadisticas] = useState<EstadisticasSpot | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (!spotId) {
      setLoading(false)
      return
    }

    const loadEstadisticas = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await obtenerEstadisticasSpot(spotId)
        setEstadisticas(data)
      } catch (err) {
        setError('Error cargando estadísticas del spot')
        setEstadisticas(null)
      } finally {
        setLoading(false)
      }
    }

    loadEstadisticas()
  }, [spotId])

  return { estadisticas, loading, error }
}
