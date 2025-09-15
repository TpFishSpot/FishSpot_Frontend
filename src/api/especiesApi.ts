import apiFishSpot from './apiFishSpot'

export interface Especie {
  id: string
  nombre_cientifico: string
  descripcion: string
  imagen?: string
  nombre_comun?: string[]
}

export interface EspecieDetallada extends Especie {
  carnadas?: any[]
  tiposPesca?: any[]
  spots?: any[]
}

export const obtenerEspecies = async (): Promise<Especie[]> => {
  try {
    const response = await apiFishSpot.get('/especie')
    return response.data.map((especie: any) => ({
      id: especie.id,
      nombre_cientifico: especie.nombre_cientifico,
      descripcion: especie.descripcion,
      imagen: especie.imagen,
      nombre_comun: especie.nombre_comun || []
    }))
  } catch (error) {
    throw error
  }
}

export const obtenerEspeciePorId = async (id: string): Promise<EspecieDetallada> => {
  try {
    const response = await apiFishSpot.get(`/especie/${id}`)
    return {
      id: response.data.id,
      nombre_cientifico: response.data.nombre_cientifico,
      descripcion: response.data.descripcion,
      imagen: response.data.imagen,
      nombre_comun: response.data.nombre_comun || [],
      carnadas: response.data.carnadas || [],
      tiposPesca: response.data.tiposPesca || [],
      spots: response.data.spots || []
    }
  } catch (error) {
    throw error
  }
}

export const buscarEspecies = async (query: string): Promise<Especie[]> => {
  try {
    const response = await apiFishSpot.get('/especie', {
      params: { search: query }
    })
    return response.data.map((especie: any) => ({
      id: especie.id,
      nombre_cientifico: especie.nombre_cientifico,
      descripcion: especie.descripcion,
      imagen: especie.imagen,
      nombre_comun: especie.nombre_comun || []
    }))
  } catch (error) {
    throw error
  }
}

export const obtenerTodasLasEspecies = async (): Promise<Especie[]> => {
  try {
    const response = await apiFishSpot.get('/especie')
    return response.data.map((especie: any) => ({
      id: especie.id,
      nombre_cientifico: especie.nombre_cientifico,
      descripcion: especie.descripcion,
      imagen: especie.imagen,
      nombre_comun: especie.nombre_comun || []
    }))
  } catch (error) {
    throw error
  }
}
