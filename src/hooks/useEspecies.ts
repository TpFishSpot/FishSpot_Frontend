import { useState, useEffect } from 'react'
import { obtenerEspecies, buscarEspecies } from '../api/especiesApi'
import type { Especie } from '../api/especiesApi'

export const useEspecies = () => {
  const [especies, setEspecies] = useState<Especie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  const loadEspecies = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await obtenerEspecies()
      setEspecies(data)
    } catch (err) {
      setError('Error cargando especies')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const searchEspecies = async (query: string) => {
    try {
      setLoading(true)
      setError('')
      const data = await buscarEspecies(query)
      setEspecies(data)
    } catch (err) {
      setError('Error buscando especies')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEspecies()
  }, [])

  return {
    especies,
    loading,
    error,
    loadEspecies,
    searchEspecies
  }
}
