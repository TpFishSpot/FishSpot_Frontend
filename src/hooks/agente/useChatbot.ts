import { useState, useCallback, useEffect, useMemo } from 'react';
import apiFishSpot from '../../api/apiFishSpot';
import type { MensajeChat, RespuestaAgenteDto, CupoInfo } from '../../modelo/Agente';
import { useAuth } from '../../contexts/AuthContext';

const STORAGE_KEY = 'fishspot_chatbot_history';
const MAX_GUEST_INTERACTIONS = 2;

export interface InitialSpotOptions {
  lugar?: string;
  latitud?: number;
  longitud?: number;
}

export const useChatbot = (initialSpot?: InitialSpotOptions) => {
  const { user } = useAuth();

  const getMensajeBienvenida = useCallback((lugar?: string) => {
    if (lugar) {
      return `¡Buenas! 🤠 Soy el Baqueano de ${lugar}. Ya tengo cargado este pesquero y sus condiciones satelitales en tiempo real. ¿Qué te gustaría saber? Preguntame sobre distancias de tiro, colores de señuelos, mareas, aparejos o qué especies están activas hoy.`;
    }
    return '¡Buenas! 🎣 Soy tu compañero de pesca de FishSpot. Decime a qué lugar querés ir a pescar o compartime tu ubicación GPS, y te armo el pronóstico ideal con clima satelital, especies activas y aparejos recomendados.';
  }, []);

  const [mensajes, setMensajes] = useState<MensajeChat[]>(() => {
    try {
      const guardados = sessionStorage.getItem(STORAGE_KEY);
      if (guardados) {
        const parsed = JSON.parse(guardados);
        if (parsed.length > 1 || (parsed.length === 1 && !initialSpot?.lugar)) {
          return parsed.map((m: any) => ({
            ...m,
            fecha: new Date(m.fecha),
          }));
        }
      }
    } catch {
      // Ignorar error de parsing
    }

    return [
      {
        id: 'msg-bienvenida',
        rol: 'asistente',
        contenido: initialSpot?.lugar
          ? `¡Buenas! 🤠 Soy el Baqueano de ${initialSpot.lugar}. Ya tengo cargado este pesquero y sus condiciones satelitales en tiempo real. ¿Qué te gustaría saber? Preguntame sobre distancias de tiro, colores de señuelos, mareas, aparejos o qué especies están activas hoy.`
          : '¡Buenas! 🎣 Soy tu compañero de pesca de FishSpot. Decime a qué lugar querés ir a pescar o compartime tu ubicación GPS, y te armo el pronóstico ideal con clima satelital, especies activas y aparejos recomendados.',
        fecha: new Date(),
      },
    ];
  });

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cupo, setCupo] = useState<CupoInfo | null>(null);

  const [lastLat, setLastLat] = useState<number | undefined>(() => {
    if (initialSpot?.latitud !== undefined) return initialSpot.latitud;
    try {
      const guardados = sessionStorage.getItem(STORAGE_KEY);
      if (guardados) {
        const parsed = JSON.parse(guardados);
        const ult = [...parsed].reverse().find((m: any) => m.respuesta?.latitud !== undefined);
        if (ult) return ult.respuesta.latitud;
      }
    } catch {}
    return undefined;
  });

  const [lastLng, setLastLng] = useState<number | undefined>(() => {
    if (initialSpot?.longitud !== undefined) return initialSpot.longitud;
    try {
      const guardados = sessionStorage.getItem(STORAGE_KEY);
      if (guardados) {
        const parsed = JSON.parse(guardados);
        const ult = [...parsed].reverse().find((m: any) => m.respuesta?.longitud !== undefined);
        if (ult) return ult.respuesta.longitud;
      }
    } catch {}
    return undefined;
  });

  const [lastLugar, setLastLugar] = useState<string | undefined>(() => {
    if (initialSpot?.lugar !== undefined) return initialSpot.lugar;
    try {
      const guardados = sessionStorage.getItem(STORAGE_KEY);
      if (guardados) {
        const parsed = JSON.parse(guardados);
        const ult = [...parsed].reverse().find((m: any) => m.respuesta?.lugar !== undefined);
        if (ult) return ult.respuesta.lugar;
      }
    } catch {}
    return undefined;
  });

  // Si se abre el chat para un spot específico y solo está el mensaje de bienvenida, actualizar el saludo
  useEffect(() => {
    if (initialSpot?.lugar) {
      setLastLugar(initialSpot.lugar);
      if (initialSpot.latitud !== undefined) setLastLat(initialSpot.latitud);
      if (initialSpot.longitud !== undefined) setLastLng(initialSpot.longitud);

      setMensajes((prev) => {
        if (prev.length === 1 && prev[0].id === 'msg-bienvenida') {
          return [
            {
              ...prev[0],
              contenido: `¡Buenas! 🤠 Soy el Baqueano de ${initialSpot.lugar}. Ya tengo cargado este pesquero y sus condiciones satelitales en tiempo real. ¿Qué te gustaría saber? Preguntame sobre distancias de tiro, colores de señuelos, mareas, aparejos o qué especies están activas hoy.`,
            },
          ];
        }
        return prev;
      });
    }
  }, [initialSpot?.lugar, initialSpot?.latitud, initialSpot?.longitud]);

  // Contador de interacciones para usuarios invitados (no logueados)
  const interaccionesInvitado = useMemo(() => {
    if (user) return 0;
    return mensajes.filter((m) => m.rol === 'usuario').length;
  }, [user, mensajes]);

  const requiereRegistro = useMemo(() => {
    return !user && interaccionesInvitado >= MAX_GUEST_INTERACTIONS;
  }, [user, interaccionesInvitado]);

  // Guardar en sessionStorage para persistir la conversación durante la sesión
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(mensajes));
    } catch {
      // Storage lleno o privado
    }
  }, [mensajes]);

  const enviarMensaje = useCallback(
    async (
      texto: string,
      opciones?: {
        lugar?: string;
        latitud?: number;
        longitud?: number;
      },
    ) => {
      const contenidoLimpio = texto.trim();
      if (!contenidoLimpio && !opciones?.latitud) return;

      // Si es usuario invitado y ya alcanzó el límite de 2 interacciones
      if (!user && interaccionesInvitado >= MAX_GUEST_INTERACTIONS) {
        setError('Para continuar chateando con FishSpot necesitás registrarte gratis.');
        return;
      }

      const mensajeUsuario: MensajeChat = {
        id: `user-${Date.now()}`,
        rol: 'usuario',
        contenido: contenidoLimpio || 'Recomendación para mi ubicación actual',
        fecha: new Date(),
        lugar: opciones?.lugar || (opciones?.latitud === undefined ? lastLugar : undefined),
        coordenadas:
          opciones?.latitud !== undefined && opciones?.longitud !== undefined
            ? { lat: opciones.latitud, lng: opciones.longitud }
            : opciones?.latitud === undefined && lastLat !== undefined && lastLng !== undefined
            ? { lat: lastLat, lng: lastLng }
            : undefined,
      };

      setMensajes((prev) => [...prev, mensajeUsuario]);
      setCargando(true);
      setError(null);

      try {
        const payload = {
          mensaje: contenidoLimpio || '¿Qué y cómo pescar en mi zona hoy?',
          lugar: opciones?.lugar || (opciones?.latitud === undefined ? lastLugar : undefined),
          latitud: opciones?.latitud !== undefined ? opciones.latitud : lastLat,
          longitud: opciones?.longitud !== undefined ? opciones.longitud : lastLng,
          usuarioId: user?.uid || undefined,
        };

        const res = await apiFishSpot.post<RespuestaAgenteDto>(
          '/agente/recomendar',
          payload,
        );
        const data = res.data;

        if (data.cupo) {
          setCupo(data.cupo);
        }

        if (data.latitud !== undefined && data.longitud !== undefined) {
          setLastLat(data.latitud);
          setLastLng(data.longitud);
          if (data.lugar) {
            setLastLugar(data.lugar);
          }
        }

        // Si es el primer mensaje de un invitado, añadimos un pie amable invitando a preguntar más
        let botText = data.mensaje;
        if (!user && interaccionesInvitado === 0) {
          botText += '\n\n🎣 ¿Querés preguntarme algo más sobre esta salida, carnadas o aparejos?';
        }

        const mensajeAsistente: MensajeChat = {
          id: `bot-${Date.now()}`,
          rol: 'asistente',
          contenido: botText,
          fecha: new Date(),
          respuesta: data,
        };

        setMensajes((prev) => [...prev, mensajeAsistente]);
      } catch (err: any) {
        const mensajeError =
          err.response?.data?.message ||
          (err.response?.status === 429
            ? 'Alcanzaste el cupo diario de consultas de IA para tu cuenta. ¡Mañana se reinicia!'
            : 'Ocurrió un problema al consultar el pronóstico de pesca. Verificá tu conexión o intentá con otro lugar.');

        setError(mensajeError);

        const mensajeErrorBot: MensajeChat = {
          id: `bot-err-${Date.now()}`,
          rol: 'asistente',
          contenido: `⚠️ ${mensajeError}`,
          fecha: new Date(),
          respuesta: {
            tipo: 'error',
            mensaje: mensajeError,
          },
        };

        setMensajes((prev) => [...prev, mensajeErrorBot]);
      } finally {
        setCargando(false);
      }
    },
    [user, interaccionesInvitado, lastLat, lastLng, lastLugar],
  );

  const consultarConUbicacionActual = useCallback(() => {
    if (!user && interaccionesInvitado >= MAX_GUEST_INTERACTIONS) {
      setError('Para continuar chateando con FishSpot necesitás registrarte gratis.');
      return;
    }

    if (!navigator.geolocation) {
      setError('La geolocalización no está disponible en tu navegador.');
      return;
    }

    setCargando(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const latitud = pos.coords.latitude;
        const longitud = pos.coords.longitude;
        enviarMensaje('¿Qué me recomendás para pescar cerca de mi ubicación actual?', {
          latitud,
          longitud,
        });
      },
      (geoErr) => {
        setCargando(false);
        const errorMsg =
          geoErr.code === geoErr.PERMISSION_DENIED
            ? 'Permiso de ubicación denegado. Podés escribir el nombre de la ciudad o río manualmente.'
            : 'No se pudo obtener la ubicación GPS.';
        setError(errorMsg);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  }, [user, interaccionesInvitado, enviarMensaje]);

  const limpiarHistorial = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setLastLat(undefined);
    setLastLng(undefined);
    setLastLugar(undefined);
    setMensajes([
      {
        id: 'msg-bienvenida',
        rol: 'asistente',
        contenido:
          '¡Conversación reiniciada! 🎣 Decime adónde querés pescar o compartime tus coordenadas.',
        fecha: new Date(),
      },
    ]);
    setError(null);
  }, []);

  return {
    mensajes,
    cargando,
    error,
    cupo,
    enviarMensaje,
    consultarConUbicacionActual,
    limpiarHistorial,
    requiereRegistro,
    interaccionesInvitado,
    MAX_GUEST_INTERACTIONS,
    esUsuarioAutenticado: !!user,
  };
};
