import { useQuery } from '@tanstack/react-query';
import { useParams } from "react-router-dom";
import apiFishSpot from "../../api/apiFishSpot";
import type { EspecieConNombreComun } from "../../modelo/EspecieConNombreComun";
import type { Carnada } from "../../modelo/Carnada";
import type { TipoPesca } from "../../modelo/TipoPesca";
import { CACHE_TIMES } from "../../constants/cache";

interface EspecieCompleteData {
  especie: EspecieConNombreComun;
  carnadas: Carnada[];
  tiposPesca: TipoPesca[];
}

const fetchEspecieComplete = async (id: string): Promise<EspecieCompleteData> => {
  const response = await apiFishSpot.get(`/especie/${id}/complete`);
  return response.data;
};

interface DetalleEspecieResult {
  especie: EspecieConNombreComun | null;
  carnadas: Carnada[];
  tiposPesca: TipoPesca[];
  cargando: boolean;
  error: string | null;
}

export function useDetalleEspecie(): DetalleEspecieResult {
  const { id } = useParams<{ id: string }>();
  
  const {
    data,
    isLoading: cargando,
    error
  } = useQuery({
    queryKey: ['especie-complete', id],
    queryFn: () => fetchEspecieComplete(id!),
    enabled: !!id,
    ...CACHE_TIMES.STATIC_DATA,
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const especie = data?.especie || null;
  const carnadas = data?.carnadas || [];
  const tiposPesca = data?.tiposPesca || [];

  return { 
    especie, 
    carnadas, 
    tiposPesca, 
    cargando, 
    error: error?.message || null 
  };
}
