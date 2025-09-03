import { useState, useEffect } from 'react'
import { obtenerTiposPesca, type TipoPesca } from '../../api/tiposPescaApi'

export const useTiposPesca = () => {
  const [tiposPesca, setTiposPesca] = useState<TipoPesca[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const cargarTiposPesca = async () => {
      try {
        setLoading(true)
        const tiposData = await obtenerTiposPesca()
        setTiposPesca(tiposData)
      } catch (err) {
        setError('Error al cargar los tipos de pesca')
      } finally {
        setLoading(false)
      }
    }

    cargarTiposPesca()
  }, [])

  const refetch = async () => {
    try {
      setLoading(true)
      const tiposData = await obtenerTiposPesca()
      setTiposPesca(tiposData)
      setError(null)
    } catch (err) {
      setError('Error al recargar los tipos de pesca')
    } finally {
      setLoading(false)
    }
  }

  return {
    tiposPesca,
    loading,
    error,
    refetch
  }
}
