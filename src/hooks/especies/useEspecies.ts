import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { obtenerEspecies, buscarEspecies } from '../../api/especiesApi';
import type { Especie } from '../../modelo/Especie';

export const useEspecies = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const {
    data: especies = [],
    isLoading: loading,
    error: queryError,
    refetch: loadEspecies,
  } = useQuery<Especie[]>({
    queryKey: searchQuery ? ['especies', searchQuery] : ['especies'],
    queryFn: () => (searchQuery ? buscarEspecies(searchQuery) : obtenerEspecies()),
    staleTime: 1000 * 30, // 30 segundos
  });

  const searchEspecies = useCallback(async (query: string) => {
    setSearchQuery(query);
  }, []);

  return {
    especies,
    loading,
    error: queryError ? 'Error cargando especies' : '',
    loadEspecies,
    searchEspecies,
  };
};
