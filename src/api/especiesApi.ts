import type { Especie } from '../modelo/Especie'
import apiFishSpot from './apiFishSpot'




export const obtenerEspecies = async (): Promise<Especie[]> => {
  try {
    const response = await apiFishSpot.get('/especie')
    return response.data.map((especie: any) => ({
      id: especie.id,
      nombreCientifico: especie.nombre_cientifico,
      descripcion: especie.descripcion,
      imagen: especie.imagen,
      nombre_comun: especie.nombre_comun || []
    }))
  } catch (error) {
    throw error
  }
}

export const obtenerEspeciePorId = async (id: string): Promise<Especie> => {
  try {
    const response = await apiFishSpot.get(`/especie/${id}`)
    return {
      id: response.data.id,
      idEspecie: response.data.idEspecie ?? response.data.id, // Ajusta según el nombre real en la API
      nombreCientifico: response.data.nombre_cientifico,
      descripcion: response.data.descripcion,
      imagen: response.data.imagen,
      nombresComunes: response.data.nombre_comun || [],
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
