import React, { useState, useRef, useEffect } from 'react';
import { useChatbot } from '../../hooks/agente/useChatbot';
import { RecomendacionCard } from './RecomendacionCard';
import {
  Bot,
  User,
  Trash2,
  Loader2,
  Compass,
  Send,
  Sparkles,
  ArrowLeft,
  Waves,
  Lock,
  UserPlus,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SUGERENCIAS_INICIALES = [
  { icon: '📍', texto: '¿Cómo está el pique en mi ubicación ahora?' },
  { icon: '🌊', texto: '¿Cómo está el pique en Mar Chiquita?' },
  { icon: '🦈', texto: '¿Qué equipo y carnada usar para Tiburón Bacota?' },
  { icon: '🐟', texto: '¿Qué especies se pescan bien en Río Salado?' },
];

export const ChatbotPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    mensajes,
    cargando,
    error,
    enviarMensaje,
    consultarConUbicacionActual,
    limpiarHistorial,
    requiereRegistro,
    esUsuarioAutenticado,
    cupo,
  } = useChatbot();

  const [inputTexto, setInputTexto] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes, cargando, requiereRegistro]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (requiereRegistro) {
      navigate('/login');
      return;
    }
    if (!inputTexto.trim() || cargando) return;
    enviarMensaje(inputTexto);
    setInputTexto('');
  };

  const handlePromptClick = (prompt: string) => {
    if (cargando) return;
    if (requiereRegistro) {
      navigate('/login');
      return;
    }
    if (prompt.includes('mi ubicación')) {
      consultarConUbicacionActual();
    } else {
      enviarMensaje(prompt);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-background text-foreground overflow-hidden h-[100dvh]">
      {/* Header Fijo Optimizado para iOS Safe Areas */}
      <header
        className="bg-card/90 backdrop-blur-md border-b border-border/50 shadow-sm z-30 shrink-0"
        style={{
          paddingTop: 'max(10px, env(safe-area-inset-top))',
        }}
      >
        <div className="max-w-3xl mx-auto px-3.5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-1 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors active:scale-95 shrink-0"
              title="Volver"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-gradient-to-tr from-primary to-primary/80 text-primary-foreground flex items-center justify-center shadow-md shadow-primary/20 shrink-0">
              <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="font-extrabold text-xs sm:text-sm text-foreground tracking-tight flex items-center gap-1.5 truncate">
                <span>Compañero IA</span>
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-primary/10 text-primary border border-primary/20 shrink-0">
                  <Sparkles className="w-2.5 h-2.5" /> En vivo
                </span>
              </h1>
              <p className="text-[10px] text-muted-foreground font-medium truncate">
                Pique satelital, clima y aparejos
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {esUsuarioAutenticado && cupo && (
              <span className="text-[10px] font-bold text-muted-foreground bg-muted/60 px-2 py-1 rounded-xl border border-border/40">
                🎣 {cupo.consultasRestantes} libres
              </span>
            )}
            <button
              onClick={limpiarHistorial}
              title="Reiniciar conversación"
              className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors active:scale-95"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Área de Conversación con Scroll Suave */}
      <main className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="max-w-3xl mx-auto space-y-4 pb-2">
          {mensajes.length === 0 ? (
            <div className="py-8 px-3 text-center max-w-md mx-auto space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-14 h-14 rounded-3xl bg-primary/10 border border-primary/20 text-primary mx-auto flex items-center justify-center shadow-lg shadow-primary/10">
                <Waves className="w-7 h-7 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h2 className="text-base sm:text-lg font-black text-foreground">¿A dónde salimos a pescar?</h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Preguntame sobre el estado del pique en cualquier río, laguna o costa argentina, qué carnada usar o cómo influye el viento.
                </p>
              </div>

              {/* Sugerencias Rápidas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-left">
                {SUGERENCIAS_INICIALES.map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePromptClick(sug.texto)}
                    className="p-3 rounded-2xl bg-card hover:bg-muted/60 border border-border/60 hover:border-primary/40 text-xs font-semibold text-foreground shadow-sm transition-all active:scale-95 flex items-center gap-2.5"
                  >
                    <span className="text-base shrink-0">{sug.icon}</span>
                    <span className="truncate">{sug.texto}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            mensajes.map((msg) => {
              const esUsuario = msg.rol === 'usuario';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2 sm:gap-2.5 ${esUsuario ? 'justify-end' : 'justify-start'} animate-in fade-in duration-200`}
                >
                  {!esUsuario && (
                    <div className="w-7 h-7 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[88%] sm:max-w-[80%] rounded-3xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed shadow-sm ${
                      esUsuario
                        ? 'bg-primary text-primary-foreground rounded-tr-none ml-auto'
                        : 'bg-card border border-border/60 text-foreground rounded-tl-none'
                    }`}
                  >
                    <p className="whitespace-pre-line font-medium">{msg.contenido}</p>

                    {/* Ficha compacta de recomendación */}
                    {msg.respuesta?.recomendacion && (
                      <RecomendacionCard recomendacion={msg.respuesta.recomendacion} />
                    )}

                    <span
                      className={`text-[9px] font-bold mt-1.5 block ${
                        esUsuario ? 'text-primary-foreground/60 text-right' : 'text-muted-foreground text-left'
                      }`}
                    >
                      {new Date(msg.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {esUsuario && (
                    <div className="w-7 h-7 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 mt-1">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* Loader de respuesta */}
          {cargando && (
            <div className="flex gap-2 items-center justify-start animate-in fade-in duration-200">
              <div className="w-7 h-7 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-card border border-border/60 text-xs text-muted-foreground shadow-sm">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-primary shrink-0" />
                <span className="font-medium">Consultando pique y clima en tiempo real...</span>
              </div>
            </div>
          )}

          {/* 🔒 BANNER DE REGISTRO GRATUITO TRAS 2 INTERACCIONES */}
          {requiereRegistro && !cargando && (
            <div className="my-4 p-5 rounded-3xl bg-gradient-to-br from-primary/15 via-card to-background border-2 border-primary/30 shadow-xl text-center space-y-3.5 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-10 h-10 rounded-2xl bg-primary/20 text-primary flex items-center justify-center mx-auto border border-primary/30 shadow-md">
                <Lock className="w-5 h-5" />
              </div>

              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-sm sm:text-base font-black text-foreground">
                  Para seguir hablando con FishSpot necesitás crear una cuenta gratuita
                </h3>
                <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                  ¡Crear tu cuenta toma 10 segundos con Google o Email! Vas a poder chatear con la IA, guardar tus spots favoritos y llevar tu bitácora de capturas.
                </p>
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 transition-all active:scale-95"
                >
                  <UserPlus className="w-4 h-4" />
                  Crear cuenta gratis / Iniciar sesión
                </button>
              </div>
            </div>
          )}

          {error && !cargando && !requiereRegistro && (
            <div className="p-3 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold text-center">
              {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Barra de Entrada Inferior Optimizada para Teclado y Safe Areas de iOS */}
      <footer
        className="bg-card/95 backdrop-blur-md border-t border-border/50 shadow-2xl z-30 shrink-0 px-3 pt-2"
        style={{
          paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
        }}
      >
        <div className="max-w-3xl mx-auto">
          {requiereRegistro ? (
            <div
              onClick={() => navigate('/login')}
              className="flex items-center justify-between gap-2.5 bg-background p-2.5 px-3.5 rounded-2xl border-2 border-primary/40 shadow-sm cursor-pointer hover:bg-muted/30 transition-all group"
            >
              <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground truncate">
                <Lock className="w-4 h-4 text-primary shrink-0" />
                <span className="text-xs font-bold truncate">Registrate gratis para seguir chateando →</span>
              </div>
              <span className="text-xs font-black uppercase text-primary underline underline-offset-4 shrink-0">
                Registrarme
              </span>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-1.5 bg-background p-1.5 pl-2.5 rounded-2xl border border-border/60 shadow-sm focus-within:ring-2 focus-within:ring-primary/40"
            >
              <button
                type="button"
                onClick={consultarConUbicacionActual}
                title="Consultar pique en mi GPS"
                disabled={cargando}
                className="p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors shrink-0 disabled:opacity-50 active:scale-95"
              >
                <Compass className="w-4 h-4" />
              </button>

              <input
                ref={inputRef}
                type="text"
                value={inputTexto}
                onChange={(e) => setInputTexto(e.target.value)}
                placeholder="Preguntale al guía (ej: Pique en Chascomús)..."
                disabled={cargando}
                style={{ fontSize: '16px' }} // Previene zoom automático molesto en iOS Safari
                className="flex-1 py-1.5 px-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none min-w-0"
              />

              <button
                type="submit"
                disabled={!inputTexto.trim() || cargando}
                className="p-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 transition-all active:scale-95 shadow-md shadow-primary/20 shrink-0"
              >
                {cargando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </form>
          )}
        </div>
      </footer>
    </div>
  );
};
