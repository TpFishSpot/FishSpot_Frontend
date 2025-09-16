import { useMemo, useEffect } from 'react';
import { useDashboardData, useFiltrarSpots } from './useOptimizedQueries';
import { useDebounce } from './usePerformance';
import { DEBOUNCE_DELAYS } from '../constants/cache';

export interface FiltroState {
  tiposPescaSeleccionados: string[];
  especiesSeleccionadas: string[];
  termino: string;
}

export const useFiltroOptimizado = (filtros: FiltroState) => {
  const { data: dashboardData, isLoading: isDashboardLoading } = useDashboardData();
  const filtrarMutation = useFiltrarSpots();
  
  const debouncedTermino = useDebounce(filtros.termino, DEBOUNCE_DELAYS.FILTER);

  useEffect(() => {
    const tieneFiltroBusqueda = filtros.tiposPescaSeleccionados.length > 0 || 
                               filtros.especiesSeleccionadas.length > 0;
    
    if (tieneFiltroBusqueda) {
      const params = {
        tiposPesca: filtros.tiposPescaSeleccionados.length > 0 ? filtros.tiposPescaSeleccionados : undefined,
        especies: filtros.especiesSeleccionadas.length > 0 ? filtros.especiesSeleccionadas : undefined,
      };
      
      filtrarMutation.mutate(params);
    }
  }, [
    filtros.tiposPescaSeleccionados, 
    filtros.especiesSeleccionadas,
    filtrarMutation
  ]);

  
  const spotsConFiltros = useMemo(() => {
    if (!dashboardData?.spots) return [];

    const tieneFiltroBusqueda = filtros.tiposPescaSeleccionados.length > 0 || 
                               filtros.especiesSeleccionadas.length > 0;

   
    if (tieneFiltroBusqueda && filtrarMutation.data) {
      return filtrarMutation.data;
    }

   
    let spots = dashboardData.spots;

    if (debouncedTermino) {
      const terminoLower = debouncedTermino.toLowerCase();
      spots = spots.filter(spot => 
        spot.nombre?.toLowerCase().includes(terminoLower) ||
        spot.descripcion?.toLowerCase().includes(terminoLower) ||
        spot.ubicacion?.toLowerCase().includes(terminoLower)
      );
    }

    return spots;
  }, [
    dashboardData?.spots,
    debouncedTermino,
    filtrarMutation.data,
    filtros.tiposPescaSeleccionados.length,
    filtros.especiesSeleccionadas.length
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