import React, { useEffect, useState } from "react"
import type { Spot } from "../modelo/Spot"
import { baseApi } from "../api/apiFishSpot"

export const ListaPendientes: React.FC = () => {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const cargarPendientes = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${baseApi}/spot/esperando`)
      const data = await res.json()
      setSpots(data)
    } catch (error) {
      console.error("Error al cargar spots pendientes:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarPendientes()
  }, [])

  const aprobar = async (id: string) => {
    await fetch(`${baseApi}/spot/${id}/aprobar`, { method: "PATCH" })
    setSpots(spots.filter((s) => s.id !== id))
  }

  const rechazar = async (id: string) => {
    await fetch(`${baseApi}/spot/${id}/rechazar`, { method: "PATCH" })
    setSpots(spots.filter((s) => s.id !== id))
  }

  const verEnMapa = (spot: Spot) => {
  const [lng, lat] = spot.ubicacion.coordinates
    window.open(
      `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`,
      "_blank"
    )
  }

  if (loading) return <p>Cargando spots pendientes...</p>

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">

      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold italic text-gray-900">
            Spots pendientes
          </h1>
          <button
            onClick={cargarPendientes}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 font-semibold text-gray-700"
          >
            🔄 Actualizar
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {spots.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            🎉 No hay spots pendientes
          </p>
        ) : (
          spots.map((spot) => (
            <div
              key={spot.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {spot.nombre}
                  </h2>
                  <p className="text-gray-600 mt-1">{spot.descripcion}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Publicado: {spot.fechaPublicacion}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => aprobar(spot.id)}
                    className="px-4 py-2 rounded-lg font-semibold bg-green-500 text-white hover:bg-green-600 transition"
                  >
                    ✅ Aprobar
                  </button>
                  <button
                    onClick={() => rechazar(spot.id)}
                    className="px-4 py-2 rounded-lg font-semibold bg-red-500 text-white hover:bg-red-600 transition"
                  >
                    ❌ Rechazar
                  </button>
                  <button
                    onClick={() => verEnMapa(spot)}
                    className="px-4 py-2 rounded-lg font-semibold bg-blue-500 text-white hover:bg-blue-600 transition"
                  >
                    🗺️ Ver en mapa
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
