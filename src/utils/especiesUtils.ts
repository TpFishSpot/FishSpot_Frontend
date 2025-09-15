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
    return `http://localhost:3000/${especie.imagen}`
  }
  
  return `http://localhost:3000/uploads/${especie.imagen}`
}
