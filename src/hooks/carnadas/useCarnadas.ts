import { useState, useEffect } from 'react'
import { obtenerCarnadas } from '../../api/carnadasApi'
import type { Carnada } from '../../modelo/Carnada'

export const useCarnadas = () => {
  const [carnadas, setCarnadas] = useState<Carnada[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const cargarCarnadas = async () => {
      try {
        setLoading(true)
        const carnadasData = await obtenerCarnadas()
        setCarnadas(carnadasData)
      } catch (err) {
        setError('Error al cargar las carnadas')
      } finally {
        setLoading(false)
      }
    }

    cargarCarnadas()
  }, [])

  const refetch = async () => {
    try {
      setLoading(true)
      const carnadasData = await obtenerCarnadas()
      setCarnadas(carnadasData)
      setError(null)
    } catch (err) {
      setError('Error al recargar las carnadas')
    } finally {
      setLoading(false)
    }
  }

  return {
    carnadas,
    loading,
    error,
    refetch
  }
}
