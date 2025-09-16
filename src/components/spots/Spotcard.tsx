import React from "react"
import type { Spot } from "../../modelo/Spot"
import { BotonBorrar } from "../botones/Botones"
import { useSwipeGestures } from "../../hooks/ui/useSwipeGestures"
import { useHapticFeedback } from "../../hooks/ui/useHapticFeedback"

interface Props {
  spot: Spot
  idUsuarioActivo: string
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onDelete: (id: string) => void
  onViewMap: (spot: Spot) => void
  onClick: () => void
}

export const SpotCard: React.FC<Props> = ({
  spot,
  idUsuarioActivo,
  onApprove,
  onReject,
  onDelete,
  onViewMap,
  onClick
}) => {
  const puedeBorrar = spot.estado === "Esperando" && spot.idUsuario === idUsuarioActivo;
  const { triggerSelectionHaptic } = useHapticFeedback();
  
  const swipeHandlers = useSwipeGestures({
    onSwipeLeft: () => {
      triggerSelectionHaptic();
      onViewMap(spot);
    },
    onSwipeRight: () => {
      triggerSelectionHaptic();
      onClick();
    }
  });
  
  return (
    <div
      {...swipeHandlers}
      onClick={onClick}
      className="bg-card rounded-xl shadow-sm border border-border p-6 cursor-pointer hover:shadow-md transition-all duration-200 active:scale-[0.98]"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{spot.nombre}</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">{spot.descripcion}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Publicado: {spot.fechaPublicacion}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {spot.estado === "Esperando" && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); onApprove(spot.id) }}
                className="min-h-[44px] px-6 py-3 rounded-lg font-semibold bg-green-500 hover:bg-green-600 text-white transition active:scale-95"
              >
                ✅ Aprobar
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onReject(spot.id) }}
                className="min-h-[44px] px-6 py-3 rounded-lg font-semibold bg-red-500 hover:bg-red-600 text-white transition active:scale-95"
              >
                ❌ Rechazar
              </button>
            </>
          )}
          {puedeBorrar && (
            <BotonBorrar id={spot.id} onDelete={onDelete}/>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onViewMap(spot) }}
            className="min-h-[44px] px-6 py-3 rounded-lg font-semibold bg-blue-500 hover:bg-blue-600 text-white transition active:scale-95"
          >
            🗺️ Ver en mapa
          </button>
        </div>
      </div>
    </div>
  )
}
