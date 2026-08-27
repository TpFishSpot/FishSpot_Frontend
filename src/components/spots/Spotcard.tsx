import React, { useState } from "react";
import type { Spot } from "../../modelo/Spot";
import { BotonBorrar } from "../botones/Botones";
import { useSwipeGestures } from "../../hooks/ui/useSwipeGestures";
import { useHapticFeedback } from "../../hooks/ui/useHapticFeedback";
import { MapContainer, Marker, TileLayer, Circle } from "react-leaflet";
import { 
  Check, 
  X as XIcon, 
  Map, 
  Calendar, 
  MapPin, 
  Eye, 
  EyeOff 
} from "lucide-react";

interface Props {
  spot: Spot
  idUsuarioActivo: string
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onDelete: (id: string) => void
  onClick: () => void
}

export const SpotCard: React.FC<Props> = ({
  spot,
  idUsuarioActivo,
  onApprove,
  onReject,
  onDelete,
  onClick
}) => {
  const [mapExpanded, setMapExpanded] = useState(false);
  const puedeBorrar = spot.estado === "Esperando" && spot.idUsuario === idUsuarioActivo;
  const { triggerSelectionHaptic } = useHapticFeedback();

  const toggleMapa = () => setMapExpanded(prev => !prev);

  const swipeHandlers = useSwipeGestures({
    onSwipeLeft: () => {
      triggerSelectionHaptic();
      toggleMapa();
    },
    onSwipeRight: () => {
      triggerSelectionHaptic();
      onClick();
    }
  });

  const [lng, lat] = spot.ubicacion.coordinates;

  // Estado Badge styling helper
  const getEstadoBadge = () => {
    switch (spot.estado) {
      case "Aceptado":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Aprobado
          </span>
        );
      case "Esperando":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Pendiente
          </span>
        );
      case "Rechazado":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Rechazado
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="group space-y-3">
      <div
        {...swipeHandlers}
        onClick={onClick}
        className="relative bg-gradient-to-br from-card via-card to-muted/20 rounded-2xl shadow-md hover:shadow-xl border border-border/50 p-5 sm:p-6 cursor-pointer transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.99] overflow-hidden"
      >
        {/* Glow de fondo decorativo al hacer hover */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight group-hover:text-primary transition-colors">
                {spot.nombre}
              </h2>
              {getEstadoBadge()}
            </div>
            
            <p className="text-sm text-muted-foreground line-clamp-2 max-w-2xl leading-relaxed">
              {spot.descripcion || "Sin descripción proporcionada."}
            </p>

            <div className="flex flex-wrap gap-4 text-xs font-semibold text-muted-foreground pt-1">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                <span>Publicado: {spot.fechaPublicacion}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-500" />
                <span>Coordenadas: {lat.toFixed(4)}, {lng.toFixed(4)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0 self-end lg:self-center">
            {spot.estado === "Esperando" && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); onApprove(spot.id); }}
                  className="inline-flex items-center gap-1.5 min-h-[40px] px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/10 transition-all active:scale-95 shrink-0"
                >
                  <Check className="w-4 h-4" />
                  Aprobar
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onReject(spot.id); }}
                  className="inline-flex items-center gap-1.5 min-h-[40px] px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/10 transition-all active:scale-95 shrink-0"
                >
                  <XIcon className="w-4 h-4" />
                  Rechazar
                </button>
              </>
            )}
            {puedeBorrar && (
              <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
                <BotonBorrar id={spot.id} onDelete={onDelete} />
              </div>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); toggleMapa(); }}
              className="inline-flex items-center gap-1.5 min-h-[40px] px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider bg-muted hover:bg-muted/80 text-foreground border border-border/80 transition-all active:scale-95 shrink-0"
            >
              {mapExpanded ? <EyeOff className="w-4 h-4 text-primary" /> : <Eye className="w-4 h-4 text-primary" />}
              {mapExpanded ? 'Ocultar mapa' : 'Ver en mapa'}
            </button>
          </div>
        </div>
      </div>

      {mapExpanded && (
        <div className="h-64 rounded-2xl overflow-hidden border border-border shadow-inner transition-all duration-300 animate-in fade-in slide-in-from-top-4">
          <MapContainer center={[lat, lng]} zoom={13} className="h-full w-full">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[lat, lng]} />
            <Circle
              center={[lat, lng]}
              radius={100}
              pathOptions={{ color: "hsl(var(--primary))", fillColor: "hsl(var(--primary))", fillOpacity: 0.15 }}
            />
          </MapContainer>
        </div>
      )}
    </div>
  );
};
