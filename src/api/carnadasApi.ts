import apiFishSpot from './apiFishSpot'
import type { Carnada } from '../modelo/Carnada'

export const obtenerCarnadas = async (): Promise<Carnada[]> => {
  try {
    const response = await apiFishSpot.get('/carnada')
    return response.data.map((carnada: any) => ({
      idCarnada: carnada.id,
      nombre: carnada.nombre,
      tipo: carnada.tipoCarnada,
      descripcion: carnada.descripcion
    }))
  } catch (error) {
    throw error
  }
}

export const obtenerCarnadaPorId = async (id: string): Promise<Carnada> => {
  try {
    const response = await apiFishSpot.get(`/carnada/${id}`)
    return {
      idCarnada: response.data.id,
      nombre: response.data.nombre,
      tipo: response.data.tipoCarnada,
      descripcion: response.data.descripcion
    }
  } catch (error) {
    throw error
  }
}

export default {
  obtenerCarnadas,
  obtenerCarnadaPorId
}