import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { Spot } from '../../modelo/Spot'
import type { TipoPesca } from '../../modelo/TipoPesca'
import type { Especie } from '../../api/especiesApi'
import { obtenerTodosLosSpots, obtenerSpotsConFiltros } from '../../api/spotsApi'
import { obtenerTiposPesca } from '../../api/tiposPescaApi'
import { obtenerTodasLasEspecies } from '../../api/especiesApi'

export const useFiltroCompleto = () => {
  const [searchParams] = useSearchParams()
  const [spots, setSpots] = useState<Spot[]>([])
  const [tiposPescaDisponibles, setTiposPescaDisponibles] = useState<TipoPesca[]>([])
  const [especiesDisponibles, setEspeciesDisponibles] = useState<Especie[]>([])
  const [tiposPescaSeleccionados, setTiposPescaSeleccionados] = useState<string[]>([])
  const [especiesSeleccionadas, setEspeciesSeleccionadas] = useState<string[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const cargarTiposPesca = async () => {
      try {
        const tipos = await obtenerTiposPesca()
        setTiposPescaDisponibles(tipos)
      } catch (err) {
        setError('Error al cargar tipos de pesca')
      }
    }
    cargarTiposPesca()
  }, [])

  useEffect(() => {
    const cargarEspecies = async () => {
      try {
        const especies = await obtenerTodasLasEspecies()
        setEspeciesDisponibles(especies)
      } catch (err) {
        setError('Error al cargar especies')
      }
    }
    cargarEspecies()
  }, [])

  useEffect(() => {
    const especieParam = searchParams.get('especie')
    if (especieParam && especiesDisponibles.length > 0) {
      if (!especiesSeleccionadas.includes(especieParam)) {
        setEspeciesSeleccionadas([especieParam])
      }
    }
  }, [searchParams, especiesDisponibles])

  useEffect(() => {
    const cargarSpots = async () => {
      try {
        setCargando(true)
        setError('')
        
        let spotsData: Spot[]
        if (tiposPescaSeleccionados.length > 0 || especiesSeleccionadas.length > 0) {
          spotsData = await obtenerSpotsConFiltros(tiposPescaSeleccionados, especiesSeleccionadas)
        } else {
          spotsData = await obtenerTodosLosSpots()
        }
        
        setSpots(spotsData)
      } catch (err) {
        setError('Error al cargar spots')
      } finally {
        setCargando(false)
      }
    }

    cargarSpots()
  }, [tiposPescaSeleccionados, especiesSeleccionadas])

  const agregarFiltroTipoPesca = (nombreTipo: string) => {
    if (!tiposPescaSeleccionados.includes(nombreTipo)) {
      setTiposPescaSeleccionados(prev => [...prev, nombreTipo])
    }
  }

  const quitarFiltroTipoPesca = (nombreTipo: string) => {
    setTiposPescaSeleccionados(prev => prev.filter(tipo => tipo !== nombreTipo))
  }

  const toggleFiltroTipoPesca = (nombreTipo: string) => {
    if (tiposPescaSeleccionados.includes(nombreTipo)) {
      quitarFiltroTipoPesca(nombreTipo)
    } else {
      agregarFiltroTipoPesca(nombreTipo)
    }
  }

  // Funciones para manejar filtros de especies
  const agregarFiltroEspecie = (nombreCientifico: string) => {
    if (!especiesSeleccionadas.includes(nombreCientifico)) {
      setEspeciesSeleccionadas(prev => [...prev, nombreCientifico])
    }
  }

  const quitarFiltroEspecie = (nombreCientifico: string) => {
    setEspeciesSeleccionadas(prev => prev.filter(especie => especie !== nombreCientifico))
  }

  const toggleFiltroEspecie = (nombreCientifico: string) => {
    if (especiesSeleccionadas.includes(nombreCientifico)) {
      quitarFiltroEspecie(nombreCientifico)
    } else {
      agregarFiltroEspecie(nombreCientifico)
    }
  }

  const limpiarFiltros = () => {
    setTiposPescaSeleccionados([])
    setEspeciesSeleccionadas([])
  }

  return {
    spots,
    tiposPescaDisponibles,
    especiesDisponibles,
    tiposPescaSeleccionados,
    especiesSeleccionadas,
    cargando,
    error,
    agregarFiltroTipoPesca,
    quitarFiltroTipoPesca,
    toggleFiltroTipoPesca,
    agregarFiltroEspecie,
    quitarFiltroEspecie,
    toggleFiltroEspecie,
    limpiarFiltros,
  }
}
