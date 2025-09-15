    import React, { useState } from 'react'
import type { TipoPesca } from '../../modelo/TipoPesca'

interface FiltroTiposPescaMapaProps {
  tiposPescaDisponibles: TipoPesca[]
  tiposPescaSeleccionados: string[]
  onToggleTipo: (tipo: string) => void
  onLimpiarFiltros: () => void
  cargando: boolean
}

export const FiltroTiposPescaMapa: React.FC<FiltroTiposPescaMapaProps> = ({
  tiposPescaDisponibles,
  tiposPescaSeleccionados,
  onToggleTipo,
  onLimpiarFiltros,
  cargando
}) => {
  const [isOpen, setIsOpen] = useState(false)

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
    <div className="absolute top-4 right-4 z-10">
      {/* Botón principal del filtro */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg shadow-md border transition-all
          ${tiposPescaSeleccionados.length > 0 
            ? 'bg-blue-600 text-white border-blue-600' 
            : 'bg-white/90 backdrop-blur-sm text-gray-700 border-gray-200 hover:bg-white'
          }
        `}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
        </svg>
        <span className="text-sm font-medium">
          {tiposPescaSeleccionados.length > 0 
            ? `${tiposPescaSeleccionados.length} filtro${tiposPescaSeleccionados.length !== 1 ? 's' : ''}`
            : 'Filtrar por tipo'
          }
        </span>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Panel desplegable */}
      {isOpen && (
        <div className="absolute top-12 right-0 bg-white rounded-lg shadow-lg border border-gray-200 p-4 min-w-80 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">Tipos de Pesca</h4>
            {tiposPescaSeleccionados.length > 0 && (
              <button
                onClick={onLimpiarFiltros}
                className="text-xs text-red-600 hover:text-red-800 px-2 py-1 rounded border border-red-200 hover:bg-red-50"
              >
                Limpiar
              </button>
            )}
          </div>

          {tiposPescaDisponibles.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              No hay tipos de pesca disponibles
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              {tiposPescaDisponibles.map((tipo) => (
                <label
                  key={tipo.id}
                  className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={tiposPescaSeleccionados.includes(tipo.nombre)}
                    onChange={() => onToggleTipo(tipo.nombre)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm text-gray-700 flex-1">
                    {tipo.nombre}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Filtros activos */}
      {tiposPescaSeleccionados.length > 0 && !isOpen && (
        <div className="mt-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md border">
          <p className="text-xs text-gray-600 mb-1">Filtros activos:</p>
          <div className="flex flex-wrap gap-1">
            {tiposPescaSeleccionados.map((tipo) => (
              <span
                key={tipo}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {tipo}
                <button
                  onClick={() => onToggleTipo(tipo)}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
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
