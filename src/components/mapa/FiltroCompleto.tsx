import type React from "react"
import { useState } from "react"
import type { TipoPesca } from "../../modelo/TipoPesca"
import type { Especie } from "../../modelo/Especie"
import { obtenerNombreMostrar, obtenerImagenEspecie } from "../../utils/especiesUtils"
import { Flame } from "lucide-react"

interface FiltroCompletoProps {
  tiposPescaDisponibles: TipoPesca[]
  especiesDisponibles: Especie[]
  tiposPescaSeleccionados: string[]
  especiesSeleccionadas: string[]
  onToggleTipoPesca: (tipo: string) => void
  onToggleEspecie: (especie: string) => void
  onLimpiarFiltros: () => void
  cargando: boolean
  distanciaMax?: number | null
  onDistanciaChange?: (distancia: number | null) => void
  isMobile?: boolean
  mostrarHeatmap?: boolean
  onToggleHeatmap?: (mostrar: boolean) => void
  mesHeatmap?: number
  onMesHeatmapChange?: (mes: number | undefined) => void
}

export const FiltroCompleto: React.FC<FiltroCompletoProps> = ({
  tiposPescaDisponibles,
  especiesDisponibles,
  tiposPescaSeleccionados,
  especiesSeleccionadas,
  onToggleTipoPesca,
  onToggleEspecie,
  onLimpiarFiltros,
  cargando,
  distanciaMax,
  onDistanciaChange,
  isMobile = false,
  mostrarHeatmap = false,
  onToggleHeatmap,
  mesHeatmap,
  onMesHeatmapChange,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"tipos" | "especies">("tipos")

  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]

  const totalFiltros = tiposPescaSeleccionados.length + especiesSeleccionadas.length

  if (cargando) {
    return (
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md z-10 border">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          <span className="text-sm text-gray-600">Cargando filtros...</span>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`absolute z-[60] flex flex-col items-end ${isMobile ? "right-2 gap-1.5" : "top-4 right-4 gap-2"}`}
      style={
        isMobile
          ? {
              top: "max(68px, calc(68px + env(safe-area-inset-top)))",
            }
          : {}
      }
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-1.5 rounded-lg shadow-md border transition-all
          ${isMobile ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"}
          ${
            totalFiltros > 0
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white/90 backdrop-blur-sm text-gray-700 border-gray-200 hover:bg-white"
          }
        `}
      >
        <svg
          className={`${isMobile ? "w-3.5 h-3.5" : "w-4 h-4"}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
          />
        </svg>
        <span className="font-medium whitespace-nowrap">
          {isMobile
            ? totalFiltros > 0
              ? `Filtros (${totalFiltros})`
              : "Filtrar"
            : totalFiltros > 0
              ? `${totalFiltros} filtro${totalFiltros !== 1 ? "s" : ""}`
              : "Filtrar spots"}
        </span>
        <svg
          className={`${isMobile ? "w-3 h-3" : "w-4 h-4"} transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {onToggleHeatmap && (
        <button
          onClick={() => onToggleHeatmap(!mostrarHeatmap)}
          className={`
            flex items-center gap-1.5 rounded-lg shadow-md border transition-all
            ${isMobile ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm"}
            ${
              mostrarHeatmap
                ? "bg-orange-600 text-white border-orange-600"
                : "bg-white/90 backdrop-blur-sm text-gray-700 border-gray-200 hover:bg-white"
            }
          `}
        >
          <Flame className={`${isMobile ? "w-3.5 h-3.5" : "w-4 h-4"}`} />
          <span className="font-medium whitespace-nowrap">{isMobile ? "Calor" : "Mapa de Calor"}</span>
        </button>
      )}

      {onDistanciaChange && (
        <div
          className={`
            bg-white backdrop-blur-sm rounded-lg shadow-md border border-gray-200 
            flex items-center gap-1.5
            ${isMobile ? "px-2.5 py-1.5 text-xs" : "px-3 py-2 text-sm"}
          `}
          style={{ colorScheme: "light" }}
        >
          <label className={`${isMobile ? "text-xs" : "text-sm"} text-gray-800 whitespace-nowrap font-medium`}>
            {isMobile ? "Dist:" : "Distancia:"}
          </label>
          <select
            value={distanciaMax ?? ""}
            onChange={(e) => onDistanciaChange(e.target.value ? Number(e.target.value) : null)}
            className={`
              border rounded px-1.5 py-0.5 
              ${isMobile ? "text-xs" : "text-sm"}
              bg-white text-gray-800 border-gray-300 
              focus:ring-2 focus:ring-blue-500 focus:outline-none
              shadow-sm
            `}
          >
            <option value="">Sin límite</option>
            {isMobile ? (
              <>
                <option value="1">1 km</option>
                <option value="5">5 km</option>
                <option value="10">10 km</option>
                <option value="25">25 km</option>
                <option value="50">50 km</option>
              </>
            ) : (
              <>
                <option value="15">15 km</option>
                <option value="30">30 km</option>
                <option value="50">50 km</option>
                <option value="100">100 km</option>
                <option value="200">200 km</option>
                <option value="300">300 km</option>
              </>
            )}
          </select>
        </div>
      )}

      {mostrarHeatmap && onMesHeatmapChange && (
        <div
          className={`
          bg-white/90 backdrop-blur-sm rounded-lg shadow-md border flex items-center gap-1.5
          ${isMobile ? "px-2.5 py-1.5 text-xs" : "px-3 py-2 text-sm"}
        `}
        >
          <label className={`${isMobile ? "text-xs" : "text-sm"} text-gray-700 whitespace-nowrap font-medium`}>
            Mes:
          </label>
          <select
            value={mesHeatmap ?? ""}
            onChange={(e) => onMesHeatmapChange(e.target.value ? Number(e.target.value) : undefined)}
            className={`border rounded px-1.5 py-0.5 ${isMobile ? "text-xs" : "text-sm"} bg-white min-w-0`}
          >
            <option value="">Todos</option>
            {meses.map((mes, idx) => (
              <option key={idx} value={idx + 1}>
                {isMobile ? mes.slice(0, 3) : mes}
              </option>
            ))}
          </select>
        </div>
      )}

      {isOpen && (
        <div
          className={`
          ${isMobile ? "fixed inset-x-2 bottom-[96px]" : "absolute top-12 right-0 w-96 max-h-96"} 
          bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden flex flex-col
        `}
          style={
            isMobile
              ? {
                  top: "max(180px, calc(180px + env(safe-area-inset-top)))",
                  bottom: "max(96px, calc(96px + env(safe-area-inset-bottom)))",
                }
              : {}
          }
        >
          <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
            <h4 className="font-medium text-gray-900">Filtros</h4>
            {totalFiltros > 0 && (
              <button
                onClick={onLimpiarFiltros}
                className="text-xs text-red-600 hover:text-red-800 px-2 py-1 rounded border border-red-200 hover:bg-red-50"
              >
                Limpiar todo
              </button>
            )}
          </div>

          <div className="flex border-b flex-shrink-0">
            <button
              onClick={() => setActiveTab("tipos")}
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "tipos"
                  ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Tipos de Pesca ({tiposPescaSeleccionados.length})
            </button>
            <button
              onClick={() => setActiveTab("especies")}
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "especies"
                  ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Especies ({especiesSeleccionadas.length})
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === "tipos" && (
              <div className="space-y-2">
                {tiposPescaDisponibles.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No hay tipos de pesca disponibles</p>
                ) : (
                  tiposPescaDisponibles.map((tipo) => (
                    <label
                      key={tipo.id}
                      className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={tiposPescaSeleccionados.includes(tipo.nombre)}
                        onChange={() => onToggleTipoPesca(tipo.nombre)}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-sm text-gray-700 flex-1">{tipo.nombre}</span>
                    </label>
                  ))
                )}
              </div>
            )}

            {activeTab === "especies" && (
              <div className="space-y-2">
                {especiesDisponibles.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No hay especies disponibles</p>
                ) : (
                  especiesDisponibles.map((especie) => {
                    const nombreEspecie = obtenerNombreMostrar(especie)
                    const imagenUrl = obtenerImagenEspecie(especie)

                    return (
                      <label
                        key={especie.id}
                        className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={especiesSeleccionadas.includes(nombreEspecie)}
                          onChange={() => onToggleEspecie(nombreEspecie)}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 focus:ring-2"
                        />
                        <div className="flex items-center gap-2 flex-1">
                          {imagenUrl && (
                            <img
                              src={imagenUrl || "/placeholder.svg"}
                              alt={nombreEspecie}
                              className="w-8 h-8 rounded-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none"
                              }}
                            />
                          )}
                          <div className="flex-1">
                            <span className="text-sm text-gray-700 block font-medium">{nombreEspecie}</span>
                            {especie.nombresComunes && especie.nombresComunes[0] && (
                              <span className="text-xs text-gray-500 italic">{especie.nombreCientifico}</span>
                            )}
                          </div>
                        </div>
                      </label>
                    )
                  })
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {!isOpen && !isMobile && totalFiltros > 0 && (
        <div className="mt-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md border max-w-sm">
          <p className="text-xs text-gray-600 mb-1">Filtros activos:</p>
          <div className="flex flex-wrap gap-1">
            {tiposPescaSeleccionados.map((tipo) => (
              <span
                key={`tipo-${tipo}`}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {tipo}
                <button onClick={() => onToggleTipoPesca(tipo)} className="hover:bg-blue-200 rounded-full p-0.5">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
            {especiesSeleccionadas.map((especie) => (
              <span
                key={`especie-${especie}`}
                className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
              >
                {especie}
                <button onClick={() => onToggleEspecie(especie)} className="hover:bg-green-200 rounded-full p-0.5">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
