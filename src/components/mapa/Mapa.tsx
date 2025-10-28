import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap, Circle, Marker, useMapEvents } from "react-leaflet"
import { SpotMarker } from "../spots/SpotMarker"
import { UseMapaLogic } from "../../hooks/ui/useMapa"
import { useSpots } from "../../hooks/spots/useSpots"
import { useFiltroCompleto } from "../../hooks/spots/useFiltroCompleto"
import { useGeolocalizacion } from "../../hooks/ui/useGeolocalizacion"
import NavigationBar from "../common/NavigationBar"
import MobileNavigationBar from "../common/MobileNavigationBar"
import { FiltroCompleto } from "./FiltroCompleto"
import { HeatmapLayer } from "./HeatmapLayer"
import { useState, useMemo, useEffect } from "react"
import { useIsMobile } from "../../hooks/useIsMobile"
import { useNavigate, useLocation } from "react-router-dom"
import { Check, X, Flame } from "lucide-react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import type { LatLngExpression } from "leaflet"
import { obtenerHeatmap } from "../../api/capturasApi"

const calcularDistancia = (coord1: [number, number], coord2: [number, number]) => {
  const R = 6371
  const dLat = ((coord2[0] - coord1[0]) * Math.PI) / 180
  const dLon = ((coord2[1] - coord1[1]) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((coord1[0] * Math.PI) / 180) *
      Math.cos((coord2[0] * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

const MoveToUser = ({ position }: { position: LatLngExpression }) => {
  const map = useMap()
  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom(), { animate: true })
    }
  }, [position])
  return null
}

const MapClickHandler = ({ 
  modoSeleccion, 
  onSeleccion 
}: { 
  modoSeleccion: boolean
  onSeleccion: (lat: number, lng: number) => void 
}) => {
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null)

  useMapEvents({
    click: (e) => {
      if (modoSeleccion) {
        onSeleccion(e.latlng.lat, e.latlng.lng)
      }
    },
    contextmenu: (e) => {
      if (modoSeleccion) {
        e.originalEvent.preventDefault()
        onSeleccion(e.latlng.lat, e.latlng.lng)
      }
    },
    mousedown: (e) => {
      if (modoSeleccion && 'latlng' in e) {
        const timer = setTimeout(() => {
          onSeleccion(e.latlng.lat, e.latlng.lng)
        }, 700)
        setPressTimer(timer)
      }
    },
    mouseup: () => {
      if (pressTimer) {
        clearTimeout(pressTimer)
        setPressTimer(null)
      }
    }
  })

  return null
}

export const Mapa = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const modoSeleccion = location.state?.modoSeleccion || false
  const volverModal = location.state?.volverModal || false
  const returnPath = location.state?.returnPath || null
  
  const { position, cargandoPosicion, esUbicacionUsuario, recargarUbicacion } = useGeolocalizacion()
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
  const [distanciaMax, setDistanciaMax] = useState<number | null>(null)
  const [puntoSeleccionado, setPuntoSeleccionado] = useState<[number, number] | null>(null)
  const [mostrarHeatmap, setMostrarHeatmap] = useState(false)
  const [heatmapData, setHeatmapData] = useState<any[]>([])
  const [mesSeleccionado, setMesSeleccionado] = useState<number>()
  const isMobile = useIsMobile()

  const handleSeleccionPunto = (lat: number, lng: number) => {
    setPuntoSeleccionado([lat, lng])
  }

  const handleConfirmarUbicacion = () => {
    if (puntoSeleccionado) {
      if (returnPath) {
        navigate(returnPath, { 
          state: { 
            lat: puntoSeleccionado[0], 
            lng: puntoSeleccionado[1] 
          } 
        })
      } else if (volverModal) {
        navigate('/nueva-captura', { 
          state: { 
            coordenadas: { lat: puntoSeleccionado[0], lng: puntoSeleccionado[1] } 
          } 
        })
      }
    }
  }

  const handleCancelarSeleccion = () => {
    navigate(-1)
  }

  useEffect(() => {
    if (mostrarHeatmap) {
      const cargarHeatmap = async () => {
        try {
          const especieId = especiesSeleccionadas.length === 1 ? especiesSeleccionadas[0] : undefined
          const data = await obtenerHeatmap(especieId, mesSeleccionado)
          setHeatmapData(data.puntos || [])
        } catch (error) {
          console.error('Error cargando heatmap:', error)
          setHeatmapData([])
        }
      }
      cargarHeatmap()
    }
  }, [mostrarHeatmap, especiesSeleccionadas, mesSeleccionado])

  useEffect(() => {
    if (isMobile) {
      const preventDefault = (e: TouchEvent) => {
        if ((e.target as HTMLElement).closest('.leaflet-container, .overflow-y-auto')) {
          return
        }
        e.preventDefault()
      }
      
      document.body.style.overflow = 'hidden'
      document.body.style.height = '100vh'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      document.body.style.top = '0'
      document.body.style.left = '0'
      document.documentElement.style.overflow = 'hidden'
      document.body.setAttribute('data-map-view', 'true')
      
      document.addEventListener('touchmove', preventDefault, { passive: false })
      
      return () => {
        document.body.style.overflow = ''
        document.body.style.height = ''
        document.body.style.position = ''
        document.body.style.width = ''
        document.body.style.top = ''
        document.body.style.left = ''
        document.documentElement.style.overflow = ''
        document.body.removeAttribute('data-map-view')
        document.removeEventListener('touchmove', preventDefault)
      }
    }
  }, [isMobile])

  const spotsParaMostrar =
    tiposPescaSeleccionados.length > 0 || especiesSeleccionadas.length > 0
      ? spotsFiltrados
      : allSpots

  const cargando = cargandoSpots || cargandoFiltros || cargandoPosicion

  const filteredSpots = useMemo(() => {
    if (!spotsParaMostrar) return []
    const query = searchQuery.trim().toLowerCase()

    return spotsParaMostrar.filter((spot: any) => {
      const coincideBusqueda =
        !query ||
        spot.nombre?.toLowerCase().includes(query) ||
        spot.descripcion?.toLowerCase().includes(query)

      const coordinates = spot.ubicacion?.coordinates
      const ubicacionValida = Array.isArray(coordinates) && coordinates.length === 2
      
      let coincideDistancia = true
      if (distanciaMax && position && ubicacionValida) {
        const lon = coordinates[0]
        const lat = coordinates[1]
        const posArray: [number, number] = Array.isArray(position)
          ? [position[0], position[1]]
          : [position.lat, position.lng]
        const distancia = calcularDistancia(posArray, [lat, lon])
        coincideDistancia = distancia <= distanciaMax
      }

      return coincideBusqueda && coincideDistancia
    })
  }, [spotsParaMostrar, searchQuery, distanciaMax, position])

  const handleSearch = (query: string) => setSearchQuery(query)

  const defaultPosition: [number, number] = [-34.9011, -56.1645]
  const centerPosition = position || defaultPosition
  const shouldShowUserLocation = esUbicacionUsuario && position

  if (cargando && cargandoPosicion) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {cargandoPosicion ? "Obteniendo ubicación..." : "Cargando spots..."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="h-screen w-screen flex flex-col overflow-hidden" 
      style={isMobile ? { 
        paddingBottom: 'max(96px, calc(96px + env(safe-area-inset-bottom)))' 
      } : {}}
    >
      {isMobile ? (
        <MobileNavigationBar onSearch={handleSearch} />
      ) : (
        <NavigationBar onSearch={handleSearch} />
      )}

      <div className="flex-1 relative overflow-hidden">
        <MapContainer
          center={centerPosition}
          zoom={esUbicacionUsuario ? 12 : 10}
          className="h-full w-full z-0"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {shouldShowUserLocation && (
            <>
              <CircleMarker
                center={position}
                radius={8}
                pathOptions={{
                  color: "#3b82f6",
                  weight: 3,
                  fillColor: "#60a5fa",
                  fillOpacity: 1,
                }}
              >
                <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={false}>
                  Estás aquí
                </Tooltip>
              </CircleMarker>

              <Circle
                center={position}
                radius={50}
                pathOptions={{
                  color: "#3b82f6",
                  weight: 2,
                  fillColor: "#60a5fa",
                  fillOpacity: 0.15,
                }}
              />

              {distanciaMax && (
                <Circle
                  center={position}
                  radius={distanciaMax * 1000}
                  pathOptions={{
                    color: "#3b82f6",
                    weight: 2,
                    fillColor: "#60a5fa",
                    fillOpacity: 0.05,
                    dashArray: "10, 10",
                  }}
                />
              )}

              <MoveToUser position={position} />
            </>
          )}

          <UseMapaLogic />

          {!mostrarHeatmap && filteredSpots.map((spot: any) => (
            <SpotMarker key={spot.id} spot={spot} />
          ))}

          {mostrarHeatmap && <HeatmapLayer puntos={heatmapData} visible={mostrarHeatmap} />}

          {modoSeleccion && (
            <>
              <MapClickHandler modoSeleccion={modoSeleccion} onSeleccion={handleSeleccionPunto} />
              {puntoSeleccionado && (
                <Marker 
                  position={puntoSeleccionado}
                  icon={L.divIcon({
                    className: 'custom-marker',
                    html: '<div style="background-color: #ef4444; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                  })}
                />
              )}
            </>
          )}
        </MapContainer>

        {modoSeleccion && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 px-4 py-3 rounded-lg shadow-lg border border-border z-[70] flex flex-col items-center gap-2">
            <p className="text-sm font-medium text-foreground">
              {puntoSeleccionado ? 'Ubicación seleccionada' : 'Haz clic en el mapa'}
            </p>
            {puntoSeleccionado && (
              <div className="flex gap-2">
                <button
                  onClick={handleConfirmarUbicacion}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Confirmar
                </button>
                <button
                  onClick={handleCancelarSeleccion}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg flex items-center gap-2 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancelar
                </button>
              </div>
            )}
          </div>
        )}

        <FiltroCompleto
          tiposPescaDisponibles={tiposPescaDisponibles}
          especiesDisponibles={especiesDisponibles}
          tiposPescaSeleccionados={tiposPescaSeleccionados}
          especiesSeleccionadas={especiesSeleccionadas}
          onToggleTipoPesca={toggleFiltroTipoPesca}
          onToggleEspecie={toggleFiltroEspecie}
          onLimpiarFiltros={limpiarFiltros}
          cargando={cargandoFiltros}
          distanciaMax={distanciaMax}
          onDistanciaChange={setDistanciaMax}
          isMobile={isMobile}
          mostrarHeatmap={mostrarHeatmap}
          onToggleHeatmap={setMostrarHeatmap}
          mesHeatmap={mesSeleccionado}
          onMesHeatmapChange={setMesSeleccionado}
        />

        {(searchQuery ||
          tiposPescaSeleccionados.length > 0 ||
          especiesSeleccionadas.length > 0) && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md z-10 border max-w-sm">
            {searchQuery && (
              <p className="text-sm text-gray-700">
                {filteredSpots.length === 0
                  ? `No se encontraron spots para "${searchQuery}"`
                  : `${filteredSpots.length} spot${filteredSpots.length !== 1 ? "s" : ""} encontrado${filteredSpots.length !== 1 ? "s" : ""} para "${searchQuery}"`}
              </p>
            )}
            {(tiposPescaSeleccionados.length > 0 ||
              especiesSeleccionadas.length > 0) && (
              <p className="text-sm text-gray-700 mt-1">
                {searchQuery ? "Con " : "Mostrando "}
                {spotsParaMostrar.length} spot{spotsParaMostrar.length !== 1 ? "s" : ""}
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
              {(tiposPescaSeleccionados.length > 0 ||
                especiesSeleccionadas.length > 0) && (
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

        {esUbicacionUsuario && (
          <button
            onClick={recargarUbicacion}
            className="absolute bottom-24 right-4 bg-white hover:bg-gray-50 text-blue-600 p-3 rounded-full shadow-lg z-10 border-2 border-blue-500 transition-all hover:scale-110 active:scale-95"
            title="Centrar en mi ubicación"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
