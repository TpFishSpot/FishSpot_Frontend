import { Fish, MapPin, Heart, Share2, ArrowLeft } from "lucide-react"
import type { Spot } from "../modelo/Spot"
import { obtenerCoordenadas, obtenerUrlImagen, obtenerColorEstado } from "../utils/spotUtils"
import UserMenu from "./usuario/UserMenu"

interface Props {
  spot: Spot
  esFavorito: boolean
  manejarFavorito: () => void
  manejarCompartir: () => void
  manejarVolver: () => void
}

export default function SpotHeader({ spot, esFavorito, manejarFavorito, manejarCompartir, manejarVolver }: Props) {
  const coordenadas = obtenerCoordenadas(spot)

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-2xl mb-8 group">
      {/* Navigation bar */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4">
        <div className="flex justify-between items-center">
          <button
            onClick={manejarVolver}
            className="flex items-center gap-2 px-4 py-2 bg-black/30 text-white rounded-xl font-medium hover:bg-black/50 transition-all duration-300 backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>
          <UserMenu />
        </div>
      </div>

      <div className="relative h-96 md:h-[500px]">
        <img
          src={obtenerUrlImagen(spot.imagenPortada)}
          alt={`Imagen de ${spot.nombre}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                <Fish className="w-6 h-6" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{spot.nombre}</h1>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border backdrop-blur-sm bg-white/90 ${obtenerColorEstado(
                  spot.estado
                )}`}
              >
                {spot.estado}
              </span>
            </div>

            {coordenadas && (
              <div className="flex items-center gap-2 text-white/90">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">
                  {coordenadas.latitud.toFixed(5)}, {coordenadas.longitud.toFixed(5)}
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={manejarFavorito}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 backdrop-blur-sm ${
                esFavorito
                  ? "bg-red-500 text-white shadow-lg shadow-red-500/25 hover:bg-red-600"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              <Heart className={`w-4 h-4 ${esFavorito ? "fill-current" : ""}`} />
              {esFavorito ? "Favorito" : "Agregar"}
            </button>

            <button
              onClick={manejarCompartir}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-xl font-medium hover:bg-white/30 transition-all duration-300 backdrop-blur-sm"
            >
              <Share2 className="w-4 h-4" />
              Compartir
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
