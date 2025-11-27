import type { Especie } from '../modelo/Especie'

export const obtenerNombreMostrar = (especie: Especie | any): string => {
  if (especie.nombresComunes && especie.nombresComunes.length > 0) {
    return especie.nombresComunes[0].nombre
  }
  
  return especie.nombreCientifico || especie.nombre_cientifico || 'Especie sin nombre'
}

export const obtenerImagenEspecie = (especie: Especie): string => {
  if (!especie.imagen) return ''
  
  if (especie.imagen.startsWith('http')) {
    return especie.imagen
  }
  
  const apiUrl = import.meta.env.VITE_API_URL || 'https://localhost:3000'
  
  if (especie.imagen.startsWith('uploads/')) {
    return `${apiUrl}/${especie.imagen}`
  }
  
  return `${apiUrl}/uploads/${especie.imagen}`
}
