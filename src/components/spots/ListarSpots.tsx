import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import NavigationBar from "../common/NavigationBar"
import MobileNavigationBar from "../common/MobileNavigationBar"
import type { Spot } from "../../modelo/Spot"
import { useAuth } from "../../contexts/AuthContext"
import { useUserRoles } from "../../hooks/auth/useUserRoles"
import apiFishSpot from "../../api/apiFishSpot"
import { MapPin, Sparkles, Plus } from "lucide-react"
import { SpotsFilter } from "./SpotsFilter"
import { PullToRefresh } from "../ui/PullToRefresh"
import { LoadingSkeleton } from "../LoadingSkeleton"
import { SpotCard } from "./Spotcard"
import { useIsMobile } from "../../hooks/useIsMobile"
import { AdminSugerenciasTab } from "./AdminSugerenciasTab"
import { SugerirModal } from "../especies/SugerirModal"

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
  const [activeTab, setActiveTab] = useState<"spots" | "sugerencias">("spots")
  const [isSugerirOpen, setIsSugerirOpen] = useState(false)

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
            {activeTab === "spots" 
              ? `Spots ${selectedFilter === "Esperando" ? "Pendientes" : "Aprobados"}` 
              : "Sugerencias de IA"}
          </h1>
          <button
            onClick={() => activeTab === "spots" ? cargarSpots(true) : window.location.reload()}
            className={`rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 font-semibold text-gray-700 dark:text-gray-200 transition-all active:scale-95 ${
              isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-2'
            }`}
          >
            {isMobile ? '🔄' : '🔄 Actualizar'}
          </button>
        </div>
      </div>

      <PullToRefresh onRefresh={() => activeTab === "spots" ? cargarSpots(true) : Promise.resolve()}>
        <div className={`max-w-6xl mx-auto space-y-4 sm:space-y-6 ${isMobile ? 'px-3 py-4' : 'px-4 py-8'}`}>
          
          {/* Tab Selector */}
          {!idUsuario && (
            <div className="flex border-b border-border/40 pb-px mb-4">
              <button
                onClick={() => setActiveTab("spots")}
                className={`pb-3 px-5 text-sm font-extrabold uppercase tracking-wider border-b-2 transition-all active:scale-95 ${
                  activeTab === "spots"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Spots de Pesca
              </button>
              <button
                onClick={() => setActiveTab("sugerencias")}
                className={`pb-3 px-5 text-sm font-extrabold uppercase tracking-wider border-b-2 transition-all active:scale-95 ${
                  activeTab === "sugerencias"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                Sugerencias de IA
              </button>
            </div>
          )}

          {/* Banner para proponer nuevo Spot o Sugerencia */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-primary/15 via-card to-emerald-500/10 border border-primary/20 shadow-sm">
            <div className="space-y-0.5">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 animate-pulse" />
                Aportes Comunitarios
              </div>
              <h3 className="text-sm sm:text-base font-bold text-foreground">
                ¿Conocés un pesquero, laguna o especie que falte?
              </h3>
              <p className="text-xs text-muted-foreground">
                Sumá tus pesqueros favoritos al mapa o proponé nuevas especies con Inteligencia Artificial.
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <button
                onClick={() => setIsSugerirOpen(true)}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Sugerir IA</span>
              </button>
              <button
                onClick={() => navigate("/crear-spot")}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs uppercase tracking-wider shadow-md shadow-primary/20 transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Crear Spot</span>
              </button>
            </div>
          </div>

          {activeTab === "spots" ? (
            <>
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
            </>
          ) : (
            <AdminSugerenciasTab />
          )}
        </div>
      </PullToRefresh>

      <SugerirModal
        isOpen={isSugerirOpen}
        onClose={() => setIsSugerirOpen(false)}
      />
    </div>
  );
};
