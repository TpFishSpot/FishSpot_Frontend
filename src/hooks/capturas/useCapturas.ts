import { useState, useEffect } from 'react'
import { obtenerCapturas, crearCaptura, actualizarCaptura, eliminarCaptura, obtenerEstadisticas } from '../../api/capturasApi'
import type { Captura, NuevaCapturaData, EstadisticasCapturas } from '../../api/capturasApi'
import { useAuth } from '../../contexts/AuthContext'

export const useCapturas = () => {
  const { user } = useAuth()
  const [capturas, setCapturas] = useState<Captura[]>([])
  const [estadisticas, setEstadisticas] = useState<EstadisticasCapturas>({
    totalCapturas: 0,
    especiesCapturadas: 0,
    pesoTotal: 0,
    capturasPorMes: 0,
    especieFavorita: ''
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  const loadCapturas = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError('')
      const [capturasData, estadisticasData] = await Promise.all([
        obtenerCapturas(),
        obtenerEstadisticas()
      ])
      setCapturas(capturasData)
      setEstadisticas(estadisticasData)
    } catch (err) {
      setError('Error cargando capturas')
    } finally {
      setLoading(false)
    }
  }

  const agregarCaptura = async (nuevaCaptura: NuevaCapturaData) => {
    try {
      setLoading(true)
      const captura = await crearCaptura(nuevaCaptura)
      setCapturas(prev => [...prev, captura])

      const nuevasEstadisticas = await obtenerEstadisticas()
      setEstadisticas(nuevasEstadisticas)

      return captura
    } catch (err) {
      setError('Error creando captura')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const editarCaptura = async (id: string, datosActualizados: Partial<NuevaCapturaData>) => {
    try {
      setLoading(true)
      const capturaActualizada = await actualizarCaptura(id, datosActualizados)
      setCapturas(prev => prev.map(c => c.id === id ? capturaActualizada : c))

      const nuevasEstadisticas = await obtenerEstadisticas()
      setEstadisticas(nuevasEstadisticas)

      return capturaActualizada
    } catch (err) {
      setError('Error actualizando captura')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const borrarCaptura = async (id: string) => {
    try {
      setLoading(true)
      await eliminarCaptura(id)
      setCapturas(prev => prev.filter(c => c.id !== id))

      const nuevasEstadisticas = await obtenerEstadisticas()
      setEstadisticas(nuevasEstadisticas)
    } catch (err) {
      setError('Error eliminando captura')
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      loadCapturas()
    }
  }, [user])

  return {
    capturas,
    estadisticas,
    loading,
    error,
    loadCapturas,
    agregarCaptura,
    editarCaptura,
    borrarCaptura
  }
}
