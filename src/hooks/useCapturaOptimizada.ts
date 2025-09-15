import { useMemo } from 'react';
import { useMisCapturas } from './useOptimizedQueries';
import type { Captura } from '../types/api';

export const useCapturaOptimizada = () => {
  const { data: capturas, isLoading, error, refetch } = useMisCapturas();

  const estadisticas = useMemo(() => {
    if (!capturas?.length) {
      return {
        totalCapturas: 0,
        especiesMasCapturada: null,
        pesoPromedio: 0,
        longitudPromedio: 0,
        ultimaCaptura: null,
      };
    }

    const especiesCount: Record<string, number> = {};
    let totalPeso = 0;
    let totalLongitud = 0;
    let countPeso = 0;
    let countLongitud = 0;

    capturas.forEach((captura: Captura) => {
      if (captura.especie?.nombresComunes?.[0]?.nombre) {
        const especieNombre = captura.especie.nombresComunes[0].nombre;
        especiesCount[especieNombre] = (especiesCount[especieNombre] || 0) + 1;
      }

      if (captura.peso && typeof captura.peso === 'number') {
        totalPeso += captura.peso;
        countPeso++;
      }

      if (captura.longitud && typeof captura.longitud === 'number') {
        totalLongitud += captura.longitud;
        countLongitud++;
      }
    });

    const especiesMasCapturada = Object.entries(especiesCount)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || null;

    return {
      totalCapturas: capturas.length,
      especiesMasCapturada,
      pesoPromedio: countPeso > 0 ? totalPeso / countPeso : 0,
      longitudPromedio: countLongitud > 0 ? totalLongitud / countLongitud : 0,
      ultimaCaptura: capturas[0] || null,
    };
  }, [capturas]);

  const capturasPorMes = useMemo(() => {
    if (!capturas?.length) return {};

    return capturas.reduce((acc: Record<string, Captura[]>, captura: Captura) => {
      const fecha = new Date(captura.fecha);
      const mesAno = `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}`;
      
      if (!acc[mesAno]) {
        acc[mesAno] = [];
      }
      acc[mesAno].push(captura);
      
      return acc;
    }, {});
  }, [capturas]);

  return {
    capturas: capturas || [],
    estadisticas,
    capturasPorMes,
    isLoading,
    error,
    refetch,
  };
};