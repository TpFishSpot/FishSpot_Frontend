import apiFishSpot from './apiFishSpot'

export interface Especie {
  id: string
  nombreCientifico: string
  descripcion: string
  imagen: string
  nombresComunes?: NombreComunEspecie[]
}

export interface NombreComunEspecie {
  id: string
  nombre: string
  idEspecie: string
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
      nombreCientifico: especie.nombreCientifico,
      descripcion: especie.descripcion,
      imagen: especie.imagen,
      nombresComunes: especie.nombresComunes || []
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
      nombreCientifico: response.data.nombreCientifico,
      descripcion: response.data.descripcion,
      imagen: response.data.imagen,
      nombresComunes: response.data.nombresComunes || [],
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
      nombreCientifico: especie.nombreCientifico,
      descripcion: especie.descripcion,
      imagen: especie.imagen,
      nombresComunes: especie.nombresComunes || []
    }))
  } catch (error) {
    console.error('Error buscando especies:', error)
    throw error
  }
}
