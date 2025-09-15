import { useState, useEffect } from 'react'
import type { Spot } from '../../modelo/Spot'
import type { TipoPesca } from '../../modelo/TipoPesca'
import { obtenerTodosLosSpots, obtenerSpotsPorTipoPesca } from '../../api/spotsApi'
import { obtenerTiposPesca } from '../../api/tiposPescaApi'

export const useFiltroSpots = () => {
  const [spots, setSpots] = useState<Spot[]>([])
  const [tiposPescaDisponibles, setTiposPescaDisponibles] = useState<TipoPesca[]>([])
  const [tiposPescaSeleccionados, setTiposPescaSeleccionados] = useState<string[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const cargarTiposPesca = async () => {
      try {
        console.log('🔄 Cargando tipos de pesca...')
        const tipos = await obtenerTiposPesca()
        console.log('✅ Tipos de pesca cargados:', tipos)
        setTiposPescaDisponibles(tipos)
      } catch (err) {
        console.error('❌ Error al cargar tipos de pesca:', err)
        setError('Error al cargar tipos de pesca')
      }
    }
    cargarTiposPesca()
  }, [])


  useEffect(() => {
    const cargarSpots = async () => {
      try {
        setCargando(true)
        setError('')
        
        let spotsData: Spot[]
        if (tiposPescaSeleccionados.length > 0) {
          spotsData = await obtenerSpotsPorTipoPesca(tiposPescaSeleccionados)
        } else {
          spotsData = await obtenerTodosLosSpots()
        }
        
        setSpots(spotsData)
      } catch (err) {
        setError('Error al cargar spots')
        console.error(err)
      } finally {
        setCargando(false)
      }
    }

    cargarSpots()
  }, [tiposPescaSeleccionados])

  const agregarFiltroTipoPesca = (nombreTipo: string) => {
    if (!tiposPescaSeleccionados.includes(nombreTipo)) {
      setTiposPescaSeleccionados([...tiposPescaSeleccionados, nombreTipo])
    }
  }

  const quitarFiltroTipoPesca = (nombreTipo: string) => {
    setTiposPescaSeleccionados(
      tiposPescaSeleccionados.filter(tipo => tipo !== nombreTipo)
    )
  }

  const limpiarFiltros = () => {
    setTiposPescaSeleccionados([])
  }

  const toggleFiltroTipoPesca = (nombreTipo: string) => {
    if (tiposPescaSeleccionados.includes(nombreTipo)) {
      quitarFiltroTipoPesca(nombreTipo)
    } else {
      agregarFiltroTipoPesca(nombreTipo)
    }
  }

  return {
    spots,
    tiposPescaDisponibles,
    tiposPescaSeleccionados,
    cargando,
    error,
    agregarFiltroTipoPesca,
    quitarFiltroTipoPesca,
    limpiarFiltros,
    toggleFiltroTipoPesca,
  }
}
