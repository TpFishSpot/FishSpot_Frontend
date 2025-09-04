import React from "react"
import type { Spot } from "../../modelo/Spot"

interface Props {
  spot: Spot
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onViewMap: (spot: Spot) => void
  onClick: () => void
}

export const SpotCard: React.FC<Props> = ({ spot, onApprove, onReject, onViewMap, onClick }) => {
  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 cursor-pointer hover:shadow-md transition"
      onClick={onClick}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{spot.nombre}</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-1">{spot.descripcion}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Publicado: {spot.fechaPublicacion}
          </p>
        </div>

        <div className="flex gap-3">
          {spot.estado === "Esperando" && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); onApprove(spot.id) }}
                className="px-4 py-2 rounded-lg font-semibold bg-green-500 hover:bg-green-600 text-white transition"
              >
                ✅ Aprobar
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onReject(spot.id) }}
                className="px-4 py-2 rounded-lg font-semibold bg-red-500 hover:bg-red-600 text-white transition"
              >
                ❌ Rechazar
              </button>
            </>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onViewMap(spot) }}
            className="px-4 py-2 rounded-lg font-semibold bg-blue-500 hover:bg-blue-600 text-white transition"
          >
            🗺️ Ver en mapa
          </button>
        </div>
      </div>
    </div>
  )
}
