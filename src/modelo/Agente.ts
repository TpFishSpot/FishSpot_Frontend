export interface EspecieRecomendada {
  nombre: string;
  senueloColor: string;
  carnada: string;
  tipoPesca: string;
}

export interface CondicionesClima {
  descripcion: string;
  temperaturaC: number | null;
  viento: string;
  probabilidadLluvia: number | null;
  nubosidadPct: number | null;
}

export interface RecomendacionAgente {
  resumen: string;
  ventanaPesca: string[];
  especies: EspecieRecomendada[];
  condiciones: CondicionesClima;
  consejoFinal: string;
}

export interface CupoInfo {
  plan: 'invitado' | 'free' | 'premium';
  consultasHoy: number;
  limiteDiario: number;
  consultasRestantes: number;
}

export type TipoRespuestaAgente = 'recomendacion' | 'aclaracion' | 'error';

export interface RespuestaAgenteDto {
  tipo: TipoRespuestaAgente;
  mensaje: string;
  recomendacion?: RecomendacionAgente;
  latitud?: number;
  longitud?: number;
  lugar?: string;
  cupo?: CupoInfo;
}

export interface MensajeChat {
  id: string;
  rol: 'usuario' | 'asistente';
  contenido: string;
  fecha: Date;
  lugar?: string;
  coordenadas?: { lat: number; lng: number };
  respuesta?: RespuestaAgenteDto;
}
