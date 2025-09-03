import apiFishSpot from './apiFishSpot'

export interface TipoPesca {
  id: string
  nombre: string
  descripcion: string
  equipamiento?: string
  ambiente?: string
}

export const obtenerTiposPesca = async (): Promise<TipoPesca[]> => {
  try {
    const response = await apiFishSpot.get('/tipopesca')
    return response.data.map((tipo: any) => ({
      id: tipo.id,
      nombre: tipo.nombre,
      descripcion: tipo.descripcion,
      equipamiento: tipo.equipamiento,
      ambiente: tipo.ambiente
    }))
  } catch (error) {
    throw error
  }
}

export const obtenerTipoPescaPorId = async (id: string): Promise<TipoPesca> => {
  try {
    const response = await apiFishSpot.get(`/tipopesca/${id}`)
    return {
      id: response.data.id,
      nombre: response.data.nombre,
      descripcion: response.data.descripcion,
      equipamiento: response.data.equipamiento,
      ambiente: response.data.ambiente
    }
  } catch (error) {
    throw error
  }
}

export default {
  obtenerTiposPesca,
  obtenerTipoPescaPorId
}
