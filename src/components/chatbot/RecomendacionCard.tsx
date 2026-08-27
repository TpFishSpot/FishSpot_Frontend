import React, { useState } from 'react';
import {
  Sun,
  Wind,
  CloudRain,
  Clock,
  Fish,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Lightbulb,
} from 'lucide-react';
import type { RecomendacionAgente } from '../../modelo/Agente';

interface Props {
  recomendacion: RecomendacionAgente;
}

export const RecomendacionCard: React.FC<Props> = ({ recomendacion }) => {
  const { condiciones, especies, ventanaPesca, consejoFinal } = recomendacion;
  const [expandido, setExpandido] = useState(false);

  return (
    <div className="mt-3 pt-3 border-t border-border/20 space-y-3">
      {/* 1. Barra de Telemetría Resumida (Pills Rápidas) */}
      <div className="flex flex-wrap items-center gap-1.5">
        {condiciones.temperaturaC !== null && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs border border-amber-500/20">
            <Sun className="w-3.5 h-3.5" />
            {condiciones.temperaturaC}°C
          </span>
        )}

        {condiciones.viento && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-semibold text-xs border border-cyan-500/20">
            <Wind className="w-3.5 h-3.5" />
            {condiciones.viento}
          </span>
        )}

        {condiciones.probabilidadLluvia !== null && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold text-xs border border-blue-500/20">
            <CloudRain className="w-3.5 h-3.5" />
            {condiciones.probabilidadLluvia}% lluvia
          </span>
        )}

        {ventanaPesca && ventanaPesca.length > 0 && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-xs border border-emerald-500/20">
            <Clock className="w-3.5 h-3.5" />
            Pique: {ventanaPesca.slice(0, 2).join(', ')}
          </span>
        )}
      </div>

      {/* 2. Especies Sugeridas (Mini Tarjetas Compactas) */}
      {especies && especies.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <Fish className="w-3.5 h-3.5 text-primary" /> Especies y Aparejos Recomendados
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {especies.map((esp, i) => (
              <div
                key={i}
                className="bg-muted/30 border border-border/40 p-2.5 rounded-2xl space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-foreground">{esp.nombre}</span>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold uppercase">
                    {esp.tipoPesca}
                  </span>
                </div>
                <div className="text-[11px] text-muted-foreground leading-tight space-y-0.5">
                  {esp.carnada && (
                    <p className="truncate">
                      <strong className="text-foreground font-semibold">🪱 Carnada:</strong> {esp.carnada}
                    </p>
                  )}
                  {esp.senueloColor && (
                    <p className="truncate">
                      <strong className="text-foreground font-semibold">✨ Señuelo:</strong> {esp.senueloColor}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Consejo Clave / Toggle Desplegable */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setExpandido(!expandido)}
          className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1 transition-colors"
        >
          <span>{expandido ? 'Ocultar detalles' : 'Ver consejo y detalles de pique'}</span>
          {expandido ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {expandido && (
          <div className="mt-2 space-y-2 p-3 bg-muted/20 rounded-2xl border border-border/30 animate-in fade-in duration-200 text-xs">
            {condiciones.descripcion && (
              <p className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground font-semibold">Condición general: </strong>
                {condiciones.descripcion}
              </p>
            )}

            {consejoFinal && (
              <div className="flex items-start gap-2 pt-1 text-amber-700 dark:text-amber-300">
                <Lightbulb className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                <p className="leading-relaxed font-medium">
                  <strong className="font-bold">Consejo del guía: </strong>
                  {consejoFinal}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
