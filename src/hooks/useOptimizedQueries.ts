import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardApi, spotsApi, capturasApi } from '../api/optimizedApi';

export const QUERY_KEYS = {
  dashboard: ['dashboard'],
  spots: ['spots'],
  spot: (id: string) => ['spot', id],
  spotEspecies: (id: string) => ['spot', id, 'especies'],
  spotTiposPesca: (id: string) => ['spot', id, 'tiposPesca'],
  spotCarnadas: (id: string) => ['spot', id, 'carnadas'],
  capturas: ['capturas'],
  misCapturas: ['capturas', 'mis'],
} as const;

export const useDashboardData = () => {
  return useQuery({
    queryKey: QUERY_KEYS.dashboard,
    queryFn: dashboardApi.getDashboardData,
    staleTime: 10 * 60 * 1000,
  });
};

export const useSpotById = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.spot(id),
    queryFn: () => spotsApi.getById(id),
    enabled: !!id,
  });
};

export const useSpotEspecies = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.spotEspecies(id),
    queryFn: () => spotsApi.getEspecies(id),
    enabled: !!id,
  });
};

export const useSpotTiposPesca = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.spotTiposPesca(id),
    queryFn: () => spotsApi.getTiposPesca(id),
    enabled: !!id,
  });
};

export const useSpotCarnadas = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.spotCarnadas(id),
    queryFn: () => spotsApi.getCarnadas(id),
    enabled: !!id,
  });
};

export const useFiltrarSpots = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: spotsApi.filtrar,
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEYS.spots, data);
    },
  });
};

export const useMisCapturas = () => {
  return useQuery({
    queryKey: QUERY_KEYS.misCapturas,
    queryFn: capturasApi.getMisCapturas,
  });
};

export const useCreateCaptura = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: capturasApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.misCapturas });
    },
  });
};

export const useUpdateCaptura = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      capturasApi.update(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.misCapturas });
    },
  });
};

export const useDeleteCaptura = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: capturasApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.misCapturas });
    },
  });
};