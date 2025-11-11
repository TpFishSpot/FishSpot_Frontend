import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import NavigationBar from "../common/NavigationBar"
import MobileNavigationBar from "../common/MobileNavigationBar"
import type { Spot } from "../../modelo/Spot"
import { useAuth } from "../../contexts/AuthContext"
import { useUserRoles } from "../../hooks/auth/useUserRoles"
import apiFishSpot from "../../api/apiFishSpot"
import { SpotsFilter } from "./SpotsFilter"
import { PullToRefresh } from "../ui/PullToRefresh"
import { LoadingSkeleton } from "../LoadingSkeleton"
import { SpotCard } from "./Spotcard"
import { useIsMobile } from "../../hooks/useIsMobile"

const filtros = [
  { id: "Esperando", name: "Pendientes" },
  { id: "Aceptado", name: "Aprobados" },
]

type ListaSpotsProps = {
  idUsuario?: string
}

export const ListaSpots: React.FC<ListaSpotsProps> = ({ idUsuario }) => {
  const [spots, setSpots] = useState<Spot[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("Esperando")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const { user } = useAuth()
  const { loading: rolesLoading } = useUserRoles()
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  const cargarSpots = async (reset = false) => {
    if (!user) return setError("Debes iniciar sesión para ver los spots");

    try {
      if (reset) setLoading(true);
      setError("");

      const actualPage = reset ? 1 : page;
      const url = idUsuario
        ? `/spot?idUsuario=${idUsuario}&estado=${selectedFilter}&page=${actualPage}`
        : `/spot?estado=${selectedFilter}&page=${actualPage}`;

      const res = await apiFishSpot.get(url);
      const { data, totalPages } = res.data;

      if (reset) setSpots(data);
      else setSpots((prev) => [...prev, ...data]);

      setHasMore(actualPage < totalPages);
    } catch (err: any) {
      setError(
        err.response?.status === 403
          ? "No tienes permisos para ver los spots"
          : "Error al cargar los spots"
      )
    } finally {
      setLoading(false)
      setIsLoadingMore(false);
    }
  }

  useEffect(() => {
    setPage(1);
    cargarSpots(true);
  }, [user, idUsuario, selectedFilter]);

  useEffect(() => {
    if (page > 1) cargarSpots();
  }, [page]);

  const aprobar = async (id: string) => {
    try {
      await apiFishSpot.patch(`/spot/${id}/aprobar`)
      setSpots(spots.map((s) => (s.id === id ? { ...s, estado: "Aceptado" } : s)))
    } catch {
      alert("Error al aprobar el spot")
    }
  }

  const rechazar = async (id: string) => {
    try {
      await apiFishSpot.patch(`/spot/${id}/rechazar`)
      setSpots(spots.map((s) => (s.id === id ? { ...s, estado: "Rechazado" } : s)));
    } catch {
      alert("Error al rechazar el spot")
    }
  }

  const borrar = async (id: string) => {
    try {
      await apiFishSpot.delete(`/spot/${id}`)
      setSpots(spots.filter(s => s.id !== id))
    } catch {
      alert("Error al borrar el spot")
    }
  }

  if (!user || rolesLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {isMobile ? <MobileNavigationBar /> : <NavigationBar />}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold italic">Spots</h1>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <LoadingSkeleton variant="spots" count={6} />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        {isMobile ? <MobileNavigationBar /> : <NavigationBar />}
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
    <div 
      className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
      style={
        isMobile
          ? {
              paddingBottom: "max(96px, calc(96px + env(safe-area-inset-bottom)))",
            }
          : {}
      }
    >
      {isMobile ? <MobileNavigationBar /> : <NavigationBar />}

      <div 
        className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm"
        style={
          isMobile
            ? {
                marginTop: "max(56px, calc(56px + env(safe-area-inset-top)))",
              }
            : {}
        }
      >
        <div className={`max-w-6xl mx-auto flex items-center justify-between ${isMobile ? 'px-3 py-4' : 'px-4 py-6'}`}>
          {isMobile && (
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Volver</span>
            </button>
          )}
          <h1 className={`font-bold italic ${isMobile ? 'text-xl' : 'text-3xl'}`}>
            Spots {selectedFilter === "Esperando" ? "Pendientes" : "Aprobados"}
          </h1>
          <button
            onClick={() => cargarSpots(true)}
            className={`rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 font-semibold text-gray-700 dark:text-gray-200 transition-all active:scale-95 ${
              isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-2'
            }`}
          >
            {isMobile ? '🔄' : '🔄 Actualizar'}
          </button>
        </div>
      </div>

      <PullToRefresh onRefresh={() => cargarSpots(true)}>
        <div className={`max-w-6xl mx-auto space-y-4 sm:space-y-6 ${isMobile ? 'px-3 py-4' : 'px-4 py-8'}`}>
          <SpotsFilter
            filtros={filtros}
            selectedFilter={selectedFilter}
            onSelect={setSelectedFilter}
          />

          {spots.map((spot) => (
            <SpotCard
              key={spot.id}
              spot={spot}
              idUsuarioActivo={user.uid}
              onApprove={aprobar}
              onReject={rechazar}
              onDelete={borrar}
              onClick={() => navigate(`/ver/${spot.id}`)}
            />
          ))}

          {hasMore ? (
            <div className="text-center pt-6">
              <button
                onClick={() => {
                  setIsLoadingMore(true);
                  setPage((p) => p + 1);
                }}
                disabled={isLoadingMore}
                className={`rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition active:scale-95 ${
                  isMobile ? 'w-full px-4 py-3 text-sm' : 'px-4 py-2'
                }`}
              >
                {isLoadingMore ? "Cargando..." : "Cargar más"}
              </button>
            </div>
          ) : (
            spots.length > 0 && (
              <p className={`text-center text-gray-500 pt-6 ${isMobile ? 'text-sm' : 'text-base'}`}>
                No hay más spots para mostrar.
              </p>
            )
          )}
        </div>
      </PullToRefresh>
    </div>
  );
};
