import apiFishSpot from './apiFishSpot'
import type { Spot } from '../modelo/Spot'

export interface SpotCreacion {
  nombre: string
  descripcion: string
  ubicacion: {
    type: string
    coordinates: [number, number]
  }
  estado: string
}

export const obtenerTodosLosSpots = async (): Promise<Spot[]> => {
  try {
    const response = await apiFishSpot.get('/spot')
    return response.data
  } catch (error) {
    throw error
  }
}

export const obtenerSpotsPorTipoPesca = async (tiposPesca: string[]): Promise<Spot[]> => {
  try {
    const response = await apiFishSpot.get('/spot/filtrar', {
      params: { tipoPesca: tiposPesca.join(',') }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export const obtenerSpotsPorEspecies = async (especies: string[]): Promise<Spot[]> => {
  try {
    const response = await apiFishSpot.get('/spot/filtrar-especies', {
      params: { especies: especies.join(',') }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export const obtenerSpotsConFiltros = async (tiposPesca: string[], especies: string[]): Promise<Spot[]> => {
  try {
    const params: any = {}
    if (tiposPesca.length > 0) {
      params.tipoPesca = tiposPesca.join(',')
    }
    if (especies.length > 0) {
      params.especies = especies.join(',')
    }

    const response = await apiFishSpot.get('/spot/filtrar-completo', { params })
    return response.data
  } catch (error) {
    throw error
  }
}

export const obtenerSpotPorId = async (id: string): Promise<Spot> => {
  try {
    const response = await apiFishSpot.get(`/spot/${id}`)
    return response.data
  } catch (error) {
    throw error
  }
}

export const crearSpot = async (spot: SpotCreacion, imagen?: File): Promise<Spot> => {
  try {
    const formData = new FormData()
    formData.append('nombre', spot.nombre)
    formData.append('descripcion', spot.descripcion)
    formData.append('ubicacion', JSON.stringify(spot.ubicacion))
    formData.append('estado', spot.estado)
    
    if (imagen) {
      formData.append('imagenPortada', imagen)
    }

    const response = await apiFishSpot.post('/spot', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export default {
  obtenerTodosLosSpots,
  obtenerSpotsPorTipoPesca,
  obtenerSpotsPorEspecies,
  obtenerSpotsConFiltros,
  obtenerSpotPorId,
  crearSpot,
}