import { useMemo } from 'react';
import { useDashboardData, useFiltrarSpots } from './useOptimizedQueries';
import { useDebounce } from './usePerformance';

export interface FiltroState {
  tiposPescaSeleccionados: string[];
  especiesSeleccionadas: string[];
  termino: string;
}

export const useFiltroOptimizado = (filtros: FiltroState) => {
  const { data: dashboardData, isLoading: isDashboardLoading } = useDashboardData();
  const filtrarMutation = useFiltrarSpots();
  
  const debouncedTermino = useDebounce(filtros.termino, 300);

  const spotsConFiltros = useMemo(() => {
    if (!dashboardData?.spots) return [];

    let spots = dashboardData.spots;

    if (debouncedTermino) {
      const terminoLower = debouncedTermino.toLowerCase();
      spots = spots.filter(spot => 
        spot.nombre?.toLowerCase().includes(terminoLower) ||
        spot.descripcion?.toLowerCase().includes(terminoLower) ||
        spot.ubicacion?.toLowerCase().includes(terminoLower)
      );
    }

    if (filtros.tiposPescaSeleccionados.length > 0 || filtros.especiesSeleccionadas.length > 0) {
      const params = {
        tiposPesca: filtros.tiposPescaSeleccionados.length > 0 ? filtros.tiposPescaSeleccionados : undefined,
        especies: filtros.especiesSeleccionadas.length > 0 ? filtros.especiesSeleccionadas : undefined,
      };

      if (params.tiposPesca || params.especies) {
        filtrarMutation.mutate(params);
        return filtrarMutation.data || [];
      }
    }

    return spots;
  }, [
    dashboardData?.spots,
    filtros.tiposPescaSeleccionados,
    filtros.especiesSeleccionadas,
    debouncedTermino,
    filtrarMutation.data
  ]);

  return {
    spots: spotsConFiltros,
    especies: dashboardData?.especies || [],
    tiposPesca: dashboardData?.tiposPesca || [],
    isLoading: isDashboardLoading || filtrarMutation.isPending,
    error: filtrarMutation.error,
    isStale: !dashboardData,
  };
};