import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import NavigationBar from "../common/NavigationBar"
import type { Spot } from "../../modelo/Spot"
import { useAuth } from "../../contexts/AuthContext"
import { useUserRoles } from "../../hooks/auth/useUserRoles"
import apiFishSpot from "../../api/apiFishSpot"
import { SpotsFilter } from "./SpotsFilter"
import { SpotCard } from "./Spotcard"

const filtros = [
  { id: "all", name: "Todos" },
  { id: "Esperando", name: "Pendientes" },
  { id: "Aceptado", name: "Aprobados" },
  { id: "Rechazado", name: "Rechazados" },
]

export const ListaSpots: React.FC = () => {
  const [spots, setSpots] = useState<Spot[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")
  const [selectedFilter, setSelectedFilter] = useState<string>("all")
  const { user } = useAuth()
  const { loading: rolesLoading } = useUserRoles()
  const navigate = useNavigate()

  const cargarSpots = async () => {
    if (!user) return setError("Debes iniciar sesión para ver los spots")

    try {
      setLoading(true)
      setError("")
      const res = await apiFishSpot.get("/spot")
      setSpots(res.data)
    } catch (error: any) {
      setError(error.response?.status === 403 ? "No tienes permisos para ver los spots" : "Error al cargar los spots")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarSpots()
  }, [user])

  const aprobar = async (id: string) => {
    try {
      await apiFishSpot.patch(`/spot/${id}/aprobar`)
      setSpots(spots.map(s => s.id === id ? { ...s, estado: "Aceptado" } : s))
    } catch {
      alert("Error al aprobar el spot")
    }
  }

  const rechazar = async (id: string) => {
    try {
      await apiFishSpot.patch(`/spot/${id}/rechazar`)
      setSpots(spots.map(s => s.id === id ? { ...s, estado: "Rechazado" } : s))
    } catch {
      alert("Error al rechazar el spot")
    }
  }

  const verEnMapa = (spot: Spot) => {
    const [lng, lat] = spot.ubicacion.coordinates
    window.open(`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`, "_blank")
  }

  const filteredSpots = spots.filter(s => selectedFilter === "all" || s.estado === selectedFilter)

  if (!user || rolesLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Cargando...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <NavigationBar />
        <div className="container mx-auto p-6">
          <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-300 px-6 py-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Error</h2>
            <p>{error}</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            >
              Volver al mapa
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <NavigationBar />

      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold italic">Spots</h1>
          <button
            onClick={cargarSpots}
            className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 font-semibold text-gray-700 dark:text-gray-200"
          >
            🔄 Actualizar
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <SpotsFilter filtros={filtros} selectedFilter={selectedFilter} onSelect={setSelectedFilter} />
        {filteredSpots.map(spot => (
          <SpotCard
            key={spot.id}
            spot={spot}
            onApprove={aprobar}
            onReject={rechazar}
            onViewMap={verEnMapa}
            onClick={() => navigate(`/ver/${spot.id}`)}
          />
        ))}
      </div>
    </div>
  )
}

