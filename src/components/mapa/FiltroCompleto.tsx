import React, { useState } from 'react'
import type { TipoPesca } from '../../modelo/TipoPesca'
import type { Especie } from '../../api/especiesApi'
import { obtenerNombreMostrar, obtenerImagenEspecie } from '../../utils/especiesUtils'

interface FiltroCompletoProps {
  tiposPescaDisponibles: TipoPesca[]
  especiesDisponibles: Especie[]
  tiposPescaSeleccionados: string[]
  especiesSeleccionadas: string[]
  onToggleTipoPesca: (tipo: string) => void
  onToggleEspecie: (especie: string) => void
  onLimpiarFiltros: () => void
  cargando: boolean
}

export const FiltroCompleto: React.FC<FiltroCompletoProps> = ({
  tiposPescaDisponibles,
  especiesDisponibles,
  tiposPescaSeleccionados,
  especiesSeleccionadas,
  onToggleTipoPesca,
  onToggleEspecie,
  onLimpiarFiltros,
  cargando
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'tipos' | 'especies'>('tipos')

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
    <div className="absolute top-4 right-4 z-10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg shadow-md border transition-all
          ${totalFiltros > 0 
            ? 'bg-blue-600 text-white border-blue-600' 
            : 'bg-white/90 backdrop-blur-sm text-gray-700 border-gray-200 hover:bg-white'
          }
        `}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
        </svg>
        <span className="text-sm font-medium">
          {totalFiltros > 0 
            ? `${totalFiltros} filtro${totalFiltros !== 1 ? 's' : ''}`
            : 'Filtrar spots'
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

      {isOpen && (
        <div className="absolute top-12 right-0 bg-white rounded-lg shadow-lg border border-gray-200 w-96 max-h-96 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b">
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

          {/* Pestañas */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('tipos')}
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'tipos'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Tipos de Pesca ({tiposPescaSeleccionados.length})
            </button>
            <button
              onClick={() => setActiveTab('especies')}
              className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'especies'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Especies ({especiesSeleccionadas.length})
            </button>
          </div>

          {/* Contenido de pestañas */}
          <div className="p-4 max-h-64 overflow-y-auto">
            {activeTab === 'tipos' && (
              <div className="space-y-2">
                {tiposPescaDisponibles.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No hay tipos de pesca disponibles
                  </p>
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
                      <span className="text-sm text-gray-700 flex-1">
                        {tipo.nombre}
                      </span>
                    </label>
                  ))
                )}
              </div>
            )}

            {activeTab === 'especies' && (
              <div className="space-y-2">
                {especiesDisponibles.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No hay especies disponibles
                  </p>
                ) : (
                  especiesDisponibles.map((especie) => {
                    const nombreEspecie = obtenerNombreMostrar(especie);
                    const imagenUrl = obtenerImagenEspecie(especie);

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
                              src={imagenUrl}
                              alt={nombreEspecie}
                              className="w-8 h-8 rounded-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          )}
                          <div className="flex-1">
                            <span className="text-sm text-gray-700 block font-medium">
                              {nombreEspecie}
                            </span>
                            {especie.nombre_comun && especie.nombre_comun[0] && (
                              <span className="text-xs text-gray-500 italic">
                                {especie.nombre_cientifico}
                              </span>
                            )}
                          </div>
                        </div>
                      </label>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filtros activos */}
      {totalFiltros > 0 && !isOpen && (
        <div className="mt-2 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md border max-w-sm">
          <p className="text-xs text-gray-600 mb-1">Filtros activos:</p>
          <div className="flex flex-wrap gap-1">
            {tiposPescaSeleccionados.map((tipo) => (
              <span
                key={`tipo-${tipo}`}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                🎣 {tipo}
                <button
                  onClick={() => onToggleTipoPesca(tipo)}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
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
                🐟 {especie}
                <button
                  onClick={() => onToggleEspecie(especie)}
                  className="hover:bg-green-200 rounded-full p-0.5"
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
