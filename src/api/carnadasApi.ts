import apiFishSpot from './apiFishSpot'

export interface Carnada {
  id: string
  nombre: string
  tipoCarnada: string
  descripcion: string
}

export const obtenerCarnadas = async (): Promise<Carnada[]> => {
  try {
    const response = await apiFishSpot.get('/carnada')
    return response.data.map((carnada: any) => ({
      id: carnada.id,
      nombre: carnada.nombre,
      tipoCarnada: carnada.tipoCarnada,
      descripcion: carnada.descripcion
    }))
  } catch (error) {
    console.error('Error obteniendo carnadas:', error)
    throw error
  }
}

export const obtenerCarnadaPorId = async (id: string): Promise<Carnada> => {
  try {
    const response = await apiFishSpot.get(`/carnada/${id}`)
    return {
      id: response.data.id,
      nombre: response.data.nombre,
      tipoCarnada: response.data.tipoCarnada,
      descripcion: response.data.descripcion
    }
  } catch (error) {
    console.error('Error obteniendo carnada:', error)
    throw error
  }
}

export default {
  obtenerCarnadas,
  obtenerCarnadaPorId
}
