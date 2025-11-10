import { useQuery } from '@tanstack/react-query';
import apiFishSpot from "../../api/apiFishSpot";
import type { Spot } from "../../modelo/Spot";
import { CACHE_TIMES } from "../../constants/cache";

const fetchSpots = async (): Promise<Spot[]> => {
  const response = await apiFishSpot.get("/spot", {
    params: {
      estado: "Aceptado",
      limit: 1000,
    },
  });
  return response.data.data; 
};

export function useSpots() {
  const {
    data: spots = [],
    isLoading: cargando,
    error,
    refetch
  } = useQuery({
    queryKey: ['spots'],
    queryFn: fetchSpots,
    ...CACHE_TIMES.DYNAMIC_DATA,
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
  });

  return { 
    spots, 
    cargando, 
    error: error?.message || null,
    refetch
  };
}
