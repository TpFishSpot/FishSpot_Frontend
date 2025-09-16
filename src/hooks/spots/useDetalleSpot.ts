import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import type { Spot } from '../../modelo/Spot';
import type { EspecieConNombreComun } from '../../modelo/EspecieConNombreComun';
import type { TipoPesca } from '../../modelo/TipoPesca';
import { CACHE_TIMES } from '../../constants/cache';

const API_BASE_URL = import.meta.env.VITE_API_URL;

interface SpotCompleteData {
  spot: Spot;
  especies: EspecieConNombreComun[];
  tiposPesca: TipoPesca[];
}


const fetchSpotComplete = async (spotId: string): Promise<SpotCompleteData> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/spot/${spotId}/complete`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error(`Spot con ID ${spotId} no encontrado`);
    }
    throw new Error(`Error cargando spot: ${error.response?.data?.message || error.message}`);
  }
};

export const useDetalleSpot = (spotId: string) => {
  const {
    data,
    isLoading,
    error,
    refetch,
    isRefetching
  } = useQuery({
    queryKey: ['spot-complete', spotId],
    queryFn: () => fetchSpotComplete(spotId),
    enabled: !!spotId,
    ...CACHE_TIMES.SEMI_STATIC_DATA,
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const spot = data?.spot;
  const especies = data?.especies || [];
  const tiposPesca = data?.tiposPesca || [];
  const loading = isLoading || isRefetching;

  return {
    spot,
    especies,
    tiposPesca,
    loading,
    error: error?.message || null,
    refetch,
  };
};
export const useSpotBasico = (spotId: string) => {
  const { spot, loading, error } = useDetalleSpot(spotId);
  
  return {
    spot,
    loading,
    error,
  };
};

export const useInvalidateSpot = () => {
  const queryClient = useQueryClient();
  
  const invalidateSpot = (spotId: string) => {
    queryClient.invalidateQueries({
      queryKey: ['spot-complete', spotId]
    });
  };
  
  const invalidateAllSpots = () => {
    queryClient.invalidateQueries({
      queryKey: ['spot-complete']
    });
  };
  
  return {
    invalidateSpot,
    invalidateAllSpots,
  };
};