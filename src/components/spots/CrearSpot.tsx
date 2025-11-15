import { ArrowLeft, Upload, MapPin, Loader2, Camera, Navigation } from "lucide-react"
import { useCrearSpot } from "../../hooks/spots/useCrearSpot"
import ListaEspeciesSeleccion from "../especies/ListaEspeciesSeleccion"
import SeleccionCarnadaTipoPesca from "../carnadas/SeleccionCarnadaTipoPesca"
import { useGeolocalizacion } from "../../hooks/ui/useGeolocalizacion"
import { useState, useEffect } from "react"
import { useIsMobile } from "../../hooks/useIsMobile"
import NavigationBar from "../common/NavigationBar"
import MobileNavigationBar from "../common/MobileNavigationBar"

const formatNumber = (num: number | undefined | null, decimals = 1): string => {
  return (num || 0).toFixed(decimals)
}

export function CrearSpot() {
  const {
    nombre,
    setNombre,
    descripcion,
    setDescripcion,
    imagePreview,
    handleImageChange,
    clearImage,
    errors,
    isLoading,
    handleSubmit,
    lat,
    lng,
    coordenadas,
    setCoordenadas,
    navigate,
    especies,
    addEspecie,
    removeEspecie,
    todasEspecies,
    carnadas,
    setCarnadas,
    tiposPesca,
    setTiposPesca,
  } = useCrearSpot()

  const { position, cargandoPosicion, esUbicacionUsuario } = useGeolocalizacion()
  const [gpsConfirmado, setGpsConfirmado] = useState(false)
  const [gpsRechazado, setGpsRechazado] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    if (position && esUbicacionUsuario && Array.isArray(position) && !coordenadas && !gpsRechazado) {
      const [latGps, lngGps] = position
      setCoordenadas({ lat: latGps, lng: lngGps })
    }
  }, [position, esUbicacionUsuario, coordenadas, gpsRechazado, setCoordenadas])

  const handleAceptarGPS = () => {
    if (position && Array.isArray(position)) {
      const [latGps, lngGps] = position
      setCoordenadas({ lat: latGps, lng: lngGps })
      setGpsConfirmado(true)
      setGpsRechazado(false)
    }
  }

  const handleRechazarGPS = () => {
    setGpsConfirmado(false)
    setGpsRechazado(true)
    setCoordenadas(null)
  }

  const handleSeleccionarEnMapa = () => {
    navigate("/mapa", { state: { modoSeleccion: true, returnPath: "/crear-spot" } })
  }

  return (
    <div 
      className="min-h-screen bg-background text-foreground"
      style={
        isMobile
          ? {
              paddingTop: "max(56px, calc(56px + env(safe-area-inset-top)))",
              paddingBottom: "max(96px, calc(96px + env(safe-area-inset-bottom)))",
            }
          : {}
      }
    >
      {isMobile ? <MobileNavigationBar /> : <NavigationBar />}
      <div className={isMobile ? 'p-3' : 'p-4'}>
        <div className="max-w-2xl mx-auto">
          <div className={`flex items-center gap-3 ${isMobile ? 'mb-4' : 'sm:gap-4 mb-4 sm:mb-6'}`}>
            <button
              onClick={() => navigate(-1)}
              className={`flex items-center justify-center rounded-full bg-card shadow-md hover:shadow-lg transition-shadow flex-shrink-0 ${isMobile ? 'w-10 h-10' : 'w-10 h-10 sm:w-12 sm:h-12'}`}
            >
              <ArrowLeft className={isMobile ? 'w-5 h-5 text-primary' : 'w-5 h-5 text-primary'} />
            </button>
            <div className="min-w-0">
              <h1 className={`font-bold text-card-foreground truncate ${isMobile ? 'text-lg' : 'text-xl sm:text-2xl'}`}>
                Crear Nuevo Spot
              </h1>
              <p className={`text-muted-foreground truncate ${isMobile ? 'text-xs' : 'text-sm sm:text-base'}`}>
                Comparte tu lugar de pesca favorito
              </p>
            </div>
          </div>

          <div className={`bg-card rounded-lg shadow-sm border border-border ${isMobile ? 'p-3 mb-4' : 'p-3 sm:p-4 mb-4 sm:mb-6'}`}>
          <label className="text-sm font-medium text-card-foreground flex items-center space-x-2 mb-3">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            <span>Ubicación *</span>
          </label>

          {!cargandoPosicion && lat && lng && !gpsConfirmado && !gpsRechazado && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className={`text-blue-800 dark:text-blue-200 mb-2 font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>
                📍 Ubicación GPS detectada
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-300 mb-3 break-all">
                Coordenadas: {formatNumber(lat, 6)}, {formatNumber(lng, 6)}
              </p>
              <div className={`flex gap-2 ${isMobile ? 'flex-col' : 'flex-col sm:flex-row'}`}>
                <button
                  type="button"
                  onClick={handleAceptarGPS}
                  className={`px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors ${isMobile ? 'flex-1 text-xs' : 'flex-1 text-sm'}`}
                >
                  Usar esta ubicación
                </button>
                <button
                  type="button"
                  onClick={handleRechazarGPS}
                  className={`px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors ${isMobile ? 'flex-1 text-xs' : 'flex-1 text-sm'}`}
                >
                  Elegir otra
                </button>
              </div>
            </div>
          )}

          {gpsConfirmado && lat && lng && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2 gap-2">
                <span className="text-sm text-green-800 dark:text-green-200 font-medium flex items-center gap-2">
                  <Navigation className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">Ubicación confirmada</span>
                </span>
                <button
                  type="button"
                  onClick={handleRechazarGPS}
                  className="text-xs text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 transition-colors whitespace-nowrap"
                >
                  Cambiar
                </button>
              </div>
              <p className="text-xs text-green-600 dark:text-green-300 break-all">
                GPS: {formatNumber(lat, 6)}, {formatNumber(lng, 6)}
              </p>
            </div>
          )}

          {(gpsRechazado || (!lat && !cargandoPosicion)) && (
            <button
              type="button"
              onClick={handleSeleccionarEnMapa}
              className={`w-full px-4 py-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors flex items-center justify-center space-x-2 ${isMobile ? 'text-sm' : 'text-sm sm:text-base'}`}
            >
              <MapPin className="w-5 h-5 flex-shrink-0" />
              <span>Seleccionar ubicación en el mapa</span>
            </button>
          )}

          {cargandoPosicion && (
            <div className="flex items-center justify-center py-4 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              <span className="text-sm">Obteniendo ubicación GPS...</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className={`bg-card rounded-xl shadow-lg space-y-4 sm:space-y-6 ${isMobile ? 'p-3' : 'p-4 sm:p-6'}`}>
          <div className="space-y-2">
            <label htmlFor="nombre" className={`block font-semibold text-card-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
              Nombre del Spot *
            </label>
            <input
              id="nombre"
              type="text"
              value={nombre}
              onChange={(e) => {
                setNombre(e.target.value)
                if (errors.nombre) errors.nombre = ""
              }}
              placeholder="Ej: Bahía del Pescador"
              className={`w-full border-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-card text-card-foreground border-border ${errors.nombre ? "border-destructive bg-destructive-foreground/10" : "hover:border-primary"} ${isMobile ? 'px-3 py-2 text-sm' : 'px-3 sm:px-4 py-2.5 sm:py-3 text-base'}`}
            />
            {errors.nombre && <p className={`text-destructive ${isMobile ? 'text-xs' : 'text-sm'}`}>{errors.nombre}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="descripcion" className={`block font-semibold text-card-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
              Descripción *
            </label>
            <textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => {
                setDescripcion(e.target.value)
                if (errors.descripcion) errors.descripcion = ""
              }}
              placeholder="Describe el spot: tipo de peces, mejores horarios, acceso, etc."
              rows={isMobile ? 3 : 4}
              className={`w-full border-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none bg-card text-card-foreground border-border ${errors.descripcion ? "border-destructive bg-destructive-foreground/10" : "hover:border-primary"} ${isMobile ? 'px-3 py-2 text-sm' : 'px-3 sm:px-4 py-2.5 sm:py-3 text-base'}`}
            />
            {errors.descripcion && <p className={`text-destructive ${isMobile ? 'text-xs' : 'text-sm'}`}>{errors.descripcion}</p>}
          </div>

          <div className="space-y-2">
            <label className={`block font-semibold text-card-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
              Especies capturadas *
            </label>
            <ListaEspeciesSeleccion
              todasEspecies={todasEspecies}
              especiesSeleccionadas={especies}
              addEspecie={addEspecie}
              removeEspecie={removeEspecie}
            />
          </div>
          <div className="space-y-2">
            <label className={`block font-semibold text-card-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
              Carnadas y técnicas de pesca
            </label>
            <SeleccionCarnadaTipoPesca
              especiesSeleccionadas={especies}
              carnadasSeleccionadas={carnadas}
              tiposPescaSeleccionados={tiposPesca}
              onCarnadaChange={setCarnadas}
              onTipoPescaChange={setTiposPesca}
            />
          </div>

          <div className="space-y-2">
            <label className={`block font-semibold text-card-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
              Imagen del Spot
            </label>
            <div className="space-y-4">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Preview"
                    className={`w-full object-cover rounded-lg border-2 border-border ${isMobile ? 'h-32' : 'h-40 sm:h-48'}`}
                  />
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute top-2 right-2 bg-destructive text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-destructive/80 transition-colors"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <label className={`flex flex-col items-center justify-center w-full border-2 border-dashed border-border rounded-lg cursor-pointer bg-card hover:bg-card/90 transition-colors ${isMobile ? 'h-32' : 'h-40 sm:h-48'}`}>
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Camera className={`mb-3 text-muted-foreground ${isMobile ? 'w-6 h-6' : 'w-8 sm:w-10 h-8 sm:h-10'}`} />
                    <p className={`mb-2 text-muted-foreground text-center px-4 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                      <span className="font-semibold">Haz clic para subir</span> una imagen
                    </p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              )}
            </div>
          </div>

          <div className={`flex gap-3 pt-4 ${isMobile ? 'flex-col' : 'flex-col sm:flex-row sm:gap-4'}`}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className={`border-2 border-border text-card-foreground rounded-lg hover:bg-card/50 transition-colors font-medium ${isMobile ? 'w-full px-4 py-2.5 text-sm' : 'w-full sm:flex-1 px-6 py-3 text-base'}`}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`bg-primary text-primary-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${isMobile ? 'w-full px-4 py-2.5 text-sm' : 'w-full sm:flex-1 px-6 py-3 text-base'}`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Creando...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" /> Crear Spot
                </>
              )}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  )
}
