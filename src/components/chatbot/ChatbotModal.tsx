import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Trash2,
  Loader2,
  Compass,
  Lock,
  UserPlus,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useChatbot } from '../../hooks/agente/useChatbot';
import { RecomendacionCard } from './RecomendacionCard';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ChatbotModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const {
    mensajes,
    cargando,
    error,
    enviarMensaje,
    consultarConUbicacionActual,
    limpiarHistorial,
    requiereRegistro,
  } = useChatbot();

  const [inputTexto, setInputTexto] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [mensajes, cargando, isOpen, requiereRegistro]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (requiereRegistro) {
      onClose();
      navigate('/login');
      return;
    }
    if (!inputTexto.trim() || cargando) return;
    enviarMensaje(inputTexto);
    setInputTexto('');
  };

  const handleSugerencia = (texto: string) => {
    if (cargando) return;
    if (requiereRegistro) {
      onClose();
      navigate('/login');
      return;
    }
    enviarMensaje(texto);
  };

  const sugerenciasRapidas = [
    { label: '📍 Mi ubicación GPS', action: consultarConUbicacionActual },
    {
      label: '🐟 ¿Qué pescar hoy?',
      action: () => handleSugerencia('¿Qué especies se están pescando bien hoy?'),
    },
    {
      label: '🌊 Río Salado',
      action: () => handleSugerencia('¿Cómo está el pique en Río Salado?'),
    },
    {
      label: '🏖️ Mar del Plata',
      action: () => handleSugerencia('Recomendame aparejos para pescar en Mar del Plata'),
    },
  ];

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-background/40 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
      {/* Contenedor Principal del Modal */}
      <div className="relative flex flex-col w-full max-w-2xl h-[92vh] max-h-[780px] rounded-3xl border border-primary/15 bg-background/95 shadow-3xl overflow-hidden text-foreground backdrop-blur-xl animate-in slide-in-from-bottom-8 duration-300">
        
        {/* Header con Glassmorphism */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/20 bg-gradient-to-r from-primary/5 via-background to-secondary/5">
          <div className="flex items-center gap-3.5">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-primary-focus text-primary-foreground shadow-lg shadow-primary/15">
              <Bot className="w-6 h-6" />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-background animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base text-foreground tracking-tight">Compañero de Pesca</h3>
                <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 shadow-sm">
                  <Sparkles className="w-2.5 h-2.5" /> IA activa
                </span>
              </div>
              <p className="text-[11px] font-medium text-muted-foreground mt-0.5">Clima satelital + Estadísticas de capturas reales</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={limpiarHistorial}
              title="Reiniciar conversación"
              className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all active:scale-95"
            >
              <Trash2 className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={onClose}
              title="Cerrar ventana"
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all active:scale-95"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sugerencias Rápidas */}
        {!requiereRegistro && (
          <div className="flex items-center gap-2 px-5 py-2.5 overflow-x-auto no-scrollbar border-b border-border/10 bg-muted/10 text-xs">
            {sugerenciasRapidas.map((sug, i) => (
              <button
                key={i}
                onClick={sug.action}
                disabled={cargando}
                className="whitespace-nowrap px-3.5 py-1.5 rounded-full bg-card border border-border/40 hover:border-primary/40 hover:bg-primary/5 text-muted-foreground hover:text-foreground font-semibold shadow-sm transition-all active:scale-95 disabled:opacity-50 text-[11px]"
              >
                {sug.label}
              </button>
            ))}
          </div>
        )}

        {/* Lista de Mensajes del Chat */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-transparent to-muted/5">
          {mensajes.map((msg) => {
            const esUsuario = msg.rol === 'usuario';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${esUsuario ? 'justify-end' : 'justify-start'}`}
              >
                {!esUsuario && (
                  <div className="flex items-center justify-center w-7 h-7 rounded-xl bg-primary/10 text-primary border border-primary/15 shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                    esUsuario
                      ? 'bg-gradient-to-br from-primary to-primary/95 text-primary-foreground rounded-tr-none ml-auto'
                      : 'bg-card border border-border/40 text-foreground rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line font-medium">{msg.contenido}</p>

                  {msg.respuesta?.recomendacion && (
                    <RecomendacionCard recomendacion={msg.respuesta.recomendacion} />
                  )}

                  <div
                    className={`mt-1.5 text-[9px] font-bold uppercase tracking-wider ${
                      esUsuario ? 'text-primary-foreground/60 text-right' : 'text-muted-foreground text-left'
                    }`}
                  >
                    {new Date(msg.fecha).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>

                {esUsuario && (
                  <div className="flex items-center justify-center w-7 h-7 rounded-xl bg-primary text-primary-foreground shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Indicador de Carga */}
          {cargando && (
            <div className="flex gap-3 justify-start items-center">
              <div className="flex items-center justify-center w-7 h-7 rounded-xl bg-primary/10 text-primary border border-primary/15 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-card border border-border/30 text-xs text-muted-foreground shadow-sm">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                <span className="font-medium">Consultando pronóstico de pesca...</span>
              </div>
            </div>
          )}

          {/* 🔒 Gate de Registro en Modal */}
          {requiereRegistro && !cargando && (
            <div className="my-4 p-5 rounded-3xl bg-gradient-to-br from-primary/15 via-card to-background border-2 border-primary/30 shadow-xl text-center space-y-3 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-10 h-10 rounded-2xl bg-primary/20 text-primary flex items-center justify-center mx-auto border border-primary/30">
                <Lock className="w-5 h-5" />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h4 className="text-sm font-black text-foreground">
                  Para seguir hablando necesitás una cuenta gratuita
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  ¡Registrate gratis para desbloquear consultas ilimitadas con la IA y guardar tus capturas!
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate('/login');
                }}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all active:scale-95"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Crear cuenta gratis
              </button>
            </div>
          )}

          {error && !cargando && !requiereRegistro && (
            <div className="text-center py-2 text-xs font-bold text-destructive bg-destructive/10 border border-destructive/20 rounded-xl px-4">
              {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Formulario de Entrada */}
        <div className="p-4 border-t border-border/10 bg-background/95 backdrop-blur-md">
          {requiereRegistro ? (
            <div
              onClick={() => {
                onClose();
                navigate('/login');
              }}
              className="flex items-center justify-between gap-3 bg-card p-3 px-4 rounded-2xl border-2 border-primary/40 shadow-md cursor-pointer hover:bg-muted/30 transition-all group"
            >
              <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground">
                <Lock className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold">Creá tu cuenta gratis para seguir chateando →</span>
              </div>
              <span className="text-xs font-black uppercase text-primary underline">
                Registrarme
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <button
                type="button"
                onClick={consultarConUbicacionActual}
                title="GPS actual"
                disabled={cargando}
                className="flex items-center justify-center w-10 h-10 rounded-2xl bg-muted hover:text-primary hover:bg-primary/10 border border-border/30 transition-all active:scale-95 disabled:opacity-50 shrink-0"
              >
                <Compass className="w-4 h-4" />
              </button>

              <input
                ref={inputRef}
                type="text"
                value={inputTexto}
                onChange={(e) => setInputTexto(e.target.value)}
                placeholder="Escribí tu consulta de pesca..."
                disabled={cargando}
                style={{ fontSize: '16px' }}
                className="w-full h-10 px-4 rounded-2xl bg-muted/40 border border-border/40 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
              />

              <button
                type="submit"
                disabled={!inputTexto.trim() || cargando}
                className="flex items-center justify-center w-10 h-10 rounded-2xl bg-primary text-primary-foreground shadow-md shadow-primary/15 hover:bg-primary/95 transition-all active:scale-95 disabled:opacity-50 shrink-0"
              >
                {cargando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
