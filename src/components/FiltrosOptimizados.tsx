import { memo, useCallback } from 'react';
import { useDebounce } from '../hooks/usePerformance';
import type { Especie, TipoPesca } from '../types/api';

interface FiltrosOptimizadosProps {
  especies: Especie[];
  tiposPesca: TipoPesca[];
  filtros: {
    tiposPescaSeleccionados: string[];
    especiesSeleccionadas: string[];
    termino: string;
  };
  onFiltrosChange: (filtros: any) => void;
  isLoading?: boolean;
}

export const FiltrosOptimizados = memo(({
  especies,
  tiposPesca,
  filtros,
  onFiltrosChange,
  isLoading
}: FiltrosOptimizadosProps) => {
  const debouncedTermino = useDebounce(filtros.termino, 300);

  const handleTerminoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltrosChange({
      ...filtros,
      termino: e.target.value
    });
  }, [filtros, onFiltrosChange]);

  const handleTipoPescaToggle = useCallback((tipoId: string) => {
    const nuevosSeleccionados = filtros.tiposPescaSeleccionados.includes(tipoId)
      ? filtros.tiposPescaSeleccionados.filter(id => id !== tipoId)
      : [...filtros.tiposPescaSeleccionados, tipoId];

    onFiltrosChange({
      ...filtros,
      tiposPescaSeleccionados: nuevosSeleccionados
    });
  }, [filtros, onFiltrosChange]);

  const handleEspecieToggle = useCallback((especieId: string) => {
    const nuevasSeleccionadas = filtros.especiesSeleccionadas.includes(especieId)
      ? filtros.especiesSeleccionadas.filter(id => id !== especieId)
      : [...filtros.especiesSeleccionadas, especieId];

    onFiltrosChange({
      ...filtros,
      especiesSeleccionadas: nuevasSeleccionadas
    });
  }, [filtros, onFiltrosChange]);

  const limpiarFiltros = useCallback(() => {
    onFiltrosChange({
      tiposPescaSeleccionados: [],
      especiesSeleccionadas: [],
      termino: ''
    });
  }, [onFiltrosChange]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
        <button
          onClick={limpiarFiltros}
          className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          disabled={isLoading}
        >
          Limpiar todo
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buscar spots
          </label>
          <input
            type="text"
            value={filtros.termino}
            onChange={handleTerminoChange}
            placeholder="Nombre, descripción o ubicación..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Tipos de Pesca ({filtros.tiposPescaSeleccionados.length} seleccionados)
          </label>
          <div className="flex flex-wrap gap-2">
            {tiposPesca.map((tipo) => (
              <button
                key={tipo.id}
                onClick={() => handleTipoPescaToggle(tipo.id)}
                disabled={isLoading}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filtros.tiposPescaSeleccionados.includes(tipo.id)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tipo.nombre}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Especies ({filtros.especiesSeleccionadas.length} seleccionadas)
          </label>
          <div className="max-h-48 overflow-y-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {especies.map((especie) => (
                <button
                  key={especie.idEspecie}
                  onClick={() => handleEspecieToggle(especie.idEspecie)}
                  disabled={isLoading}
                  className={`p-2 text-left rounded-md text-sm transition-colors ${
                    filtros.especiesSeleccionadas.includes(especie.idEspecie)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="font-medium">
                    {especie.nombresComunes?.[0]?.nombre || especie.nombreCientifico}
                  </div>
                  {especie.nombresComunes?.[0]?.nombre && (
                    <div className="text-xs opacity-75">
                      {especie.nombreCientifico}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});