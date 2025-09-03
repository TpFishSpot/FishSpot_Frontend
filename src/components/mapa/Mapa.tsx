import { MapContainer, TileLayer } from "react-leaflet"
import { SpotMarker } from "../spots/SpotMarker"
import { UseMapaLogic } from "../../hooks/ui/useMapa"
import { useSpots } from "../../hooks/spots/useSpots"
import NavigationBar from "../common/NavigationBar"
import type { LatLngExpression } from "leaflet"
import { useState, useMemo } from "react"
import "leaflet/dist/leaflet.css"

export const Mapa = () => {
  const initialPosition: LatLngExpression = [-35.7627, -58.4915]
  const { spots, cargando } = useSpots()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredSpots = useMemo(() => {
    if (!searchQuery.trim()) return spots

    const query = searchQuery.toLowerCase()
    return spots.filter(spot =>
      spot.nombre?.toLowerCase().includes(query) ||
      spot.descripcion?.toLowerCase().includes(query)
    )
  }, [spots, searchQuery])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  if (cargando) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando spots...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen flex flex-col">
      <NavigationBar onSearch={handleSearch} />
      <div className="flex-1 relative">
        <MapContainer center={initialPosition} zoom={14} className="h-full w-full z-0">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          <UseMapaLogic />

          {filteredSpots.map((spot) => (
            <SpotMarker key={spot.id} spot={spot} />
          ))}
        </MapContainer>

        {}
        {searchQuery && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md z-10 border">
            <p className="text-sm text-gray-700">
              {filteredSpots.length === 0
                ? `No se encontraron spots para "${searchQuery}"`
                : `${filteredSpots.length} spot${filteredSpots.length !== 1 ? 's' : ''} encontrado${filteredSpots.length !== 1 ? 's' : ''} para "${searchQuery}"`
              }
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs text-blue-600 hover:text-blue-800 mt-1"
            >
              Limpiar búsqueda
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
