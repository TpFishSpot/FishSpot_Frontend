import { MapContainer, TileLayer } from "react-leaflet"
import { SpotMarker } from "../spots/SpotMarker"
import { UseMapaLogic } from "../../hooks/ui/useMapa"
import { useSpots } from "../../hooks/spots/useSpots"
import { useFiltroCompleto } from "../../hooks/spots/useFiltroCompleto"
import { useGeolocalizacion } from "../../hooks/ui/useGeolocalizacion"
import NavigationBar from "../common/NavigationBar"
import { FiltroCompleto } from "./FiltroCompleto"
import { useState, useMemo } from "react"
import "leaflet/dist/leaflet.css"

export const Mapa = () => {
  const { position, cargandoPosicion, esUbicacionUsuario } = useGeolocalizacion()
  const { spots: allSpots, cargando: cargandoSpots } = useSpots()
  const {
    spots: spotsFiltrados,
    tiposPescaDisponibles,
    especiesDisponibles,
    tiposPescaSeleccionados,
    especiesSeleccionadas,
    cargando: cargandoFiltros,
    toggleFiltroTipoPesca,
    toggleFiltroEspecie,
    limpiarFiltros,
  } = useFiltroCompleto()
  const [searchQuery, setSearchQuery] = useState("")

  const spotsParaMostrar = (tiposPescaSeleccionados.length > 0 || especiesSeleccionadas.length > 0) ? spotsFiltrados : allSpots
  const cargando = cargandoSpots || cargandoFiltros || cargandoPosicion

  const filteredSpots = useMemo(() => {
    if (!searchQuery.trim()) return spotsParaMostrar

    const query = searchQuery.toLowerCase()
    return spotsParaMostrar.filter((spot: any) =>
      spot.nombre?.toLowerCase().includes(query) ||
      spot.descripcion?.toLowerCase().includes(query)
    )
  }, [spotsParaMostrar, searchQuery])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  if (cargando || !position) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {cargandoPosicion ? 'Obteniendo ubicación...' : 'Cargando spots...'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen flex flex-col">
      <NavigationBar onSearch={handleSearch} />
      <div className="flex-1 relative">
        <MapContainer 
          center={position} 
          zoom={esUbicacionUsuario ? 12 : 10} 
          className="h-full w-full z-0 [&_.leaflet-control-attribution]:hidden [&_.leaflet-bottom]:hidden"
          attributionControl={false}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution=""
          />

          <UseMapaLogic />

          {filteredSpots.map((spot: any) => (
            <SpotMarker key={spot.id} spot={spot} />
          ))}
        </MapContainer>

        <FiltroCompleto
          tiposPescaDisponibles={tiposPescaDisponibles}
          especiesDisponibles={especiesDisponibles}
          tiposPescaSeleccionados={tiposPescaSeleccionados}
          especiesSeleccionadas={especiesSeleccionadas}
          onToggleTipoPesca={toggleFiltroTipoPesca}
          onToggleEspecie={toggleFiltroEspecie}
          onLimpiarFiltros={limpiarFiltros}
          cargando={cargandoFiltros}
        />

        {(searchQuery || tiposPescaSeleccionados.length > 0 || especiesSeleccionadas.length > 0) && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md z-10 border max-w-sm">
            {searchQuery && (
              <p className="text-sm text-gray-700">
                {filteredSpots.length === 0
                  ? `No se encontraron spots para "${searchQuery}"`
                  : `${filteredSpots.length} spot${filteredSpots.length !== 1 ? 's' : ''} encontrado${filteredSpots.length !== 1 ? 's' : ''} para "${searchQuery}"`
                }
              </p>
            )}
            {(tiposPescaSeleccionados.length > 0 || especiesSeleccionadas.length > 0) && (
              <p className="text-sm text-gray-700 mt-1">
                {searchQuery ? 'Con ' : 'Mostrando '}
                {spotsParaMostrar.length} spot{spotsParaMostrar.length !== 1 ? 's' : ''} 
                {tiposPescaSeleccionados.length > 0 && especiesSeleccionadas.length > 0 
                  ? ` para ${tiposPescaSeleccionados.length} tipo${tiposPescaSeleccionados.length !== 1 ? 's' : ''} de pesca y ${especiesSeleccionadas.length} especie${especiesSeleccionadas.length !== 1 ? 's' : ''}`
                  : tiposPescaSeleccionados.length > 0
                    ? tiposPescaSeleccionados.length === 1 
                      ? ` para ${tiposPescaSeleccionados[0]}`
                      : ` para ${tiposPescaSeleccionados.length} tipos de pesca`
                    : especiesSeleccionadas.length === 1
                      ? ` para ${especiesSeleccionadas[0]}`
                      : ` para ${especiesSeleccionadas.length} especies`
                }
              </p>
            )}
            <div className="flex gap-2 mt-2">
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Limpiar búsqueda
                </button>
              )}
              {(tiposPescaSeleccionados.length > 0 || especiesSeleccionadas.length > 0) && (
                <button
                  onClick={limpiarFiltros}
                  className="text-xs text-red-600 hover:text-red-800"
                >
                  Quitar filtros
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
