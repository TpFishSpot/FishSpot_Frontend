import type { Especie } from '../api/especiesApi'

export const obtenerNombreMostrar = (especie: Especie): string => {
  return especie.nombre_comun && especie.nombre_comun[0] 
    ? especie.nombre_comun[0] 
    : especie.nombre_cientifico
}

export const obtenerImagenEspecie = (especie: Especie): string => {
  if (!especie.imagen) return ''
  
  if (especie.imagen.startsWith('http')) {
    return especie.imagen
  }
  
  if (especie.imagen.startsWith('uploads/')) {
    return `${import.meta.env.BASE_URL}/${especie.imagen}`
  }
  
  return `${import.meta.env.BASE_URL}/uploads/${especie.imagen}`
}
