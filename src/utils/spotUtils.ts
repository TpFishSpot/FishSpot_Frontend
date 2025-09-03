import type { Spot } from "../modelo/Spot"

export const obtenerCoordenadas = (spot: Spot) => {
  if (!spot.ubicacion?.coordinates) return null
  const [longitud, latitud] = spot.ubicacion.coordinates
  return { latitud, longitud }
}

export const obtenerUrlImagen = (imagenPortada?: string) => {
  if (!imagenPortada) return "/fishing-spot-lake.png"
  if (imagenPortada.startsWith("http")) return imagenPortada
  return `apiFishSpot/${imagenPortada.startsWith("/") ? imagenPortada.slice(1) : imagenPortada}`
}

export const obtenerColorEstado = (estado: string) => {
  switch (estado) {
    case "Aceptado":
      return "bg-emerald-100 text-emerald-800 border-emerald-200"
    case "Rechazado":
      return "bg-red-100 text-red-800 border-red-200"
    case "Esperando":
      return "bg-amber-100 text-amber-800 border-amber-200"
    case "Inactivo":
      return "bg-gray-100 text-gray-800 border-gray-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}