import { useState, useEffect } from 'react'
import { obtenerCapturasDestacadas } from '../../api/capturasApi'
import type { Captura } from '../../modelo/Captura'

export const useCapturasDestacadas = (spotId: string | undefined) => {
  const [capturas, setCapturas] = useState<Captura[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    if (!spotId) {
      setLoading(false)
      return
    }

    const loadCapturas = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await obtenerCapturasDestacadas(spotId)
        setCapturas(data)
      } catch (err) {
        setError('Error cargando capturas destacadas')
        setCapturas([])
      } finally {
        setLoading(false)
      }
    }

    loadCapturas()
  }, [spotId])

  return { capturas, loading, error }
}
