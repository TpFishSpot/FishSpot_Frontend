import React, { useState } from "react"
import { Search, Heart, Fish, MapPin, Zap, Compass, Sparkles } from "lucide-react"
import { useNavigate } from "react-router-dom"
import NavigationBar from "../common/NavigationBar"
import { useEspecies } from "../../hooks/especies/useEspecies"
import MobileNavigationBar from "../common/MobileNavigationBar"
import { useIsMobile } from "../../hooks/useIsMobile"
import { baseApi } from "../../api/apiFishSpot"
import { ImagenResponsive } from "../common/imgenResponsive"
import { SugerirModal } from "./SugerirModal"

const obtenerUrlImagenEspecie = (imagen?: string) => {
  if (!imagen) return "/placeholder-fish.png"
  if (imagen.startsWith("http")) return imagen
  return `${baseApi}/${imagen.startsWith("/") ? imagen.slice(1) : imagen}`
}

const GuiaEspecies: React.FC = () => {
  const navigate = useNavigate()
  const { especies, loading, loadEspecies } = useEspecies()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState<string>("all")
  const [favorites, setFavorites] = useState<string[]>([])
  const [isSugerirOpen, setIsSugerirOpen] = useState(false)
  const [sugerirInitialNombre, setSugerirInitialNombre] = useState("")
  const isMobile = useIsMobile()

  const filters = [
    { id: "all", name: "Todas", icon: Fish },
    { id: "sea", name: "Mar", icon: Compass },
    { id: "river", name: "Río", icon: MapPin },
    { id: "lake", name: "Laguna", icon: MapPin },
    { id: "predator", name: "Depredadores", icon: Zap },
    { id: "favorites", name: "Favoritos", icon: Heart },
  ]

  React.useEffect(() => {
    loadFavorites()
    loadEspecies()
  }, [])

  const loadFavorites = () => {
    const saved = localStorage.getItem("favorites-especies")
    if (saved) {
      setFavorites(JSON.parse(saved))
    }
  }

  const toggleFavorite = (especieId: string) => {
    const newFavorites = favorites.includes(especieId)
      ? favorites.filter((id) => id !== especieId)
      : [...favorites, especieId]

    setFavorites(newFavorites)
    localStorage.setItem("favorites-especies", JSON.stringify(newFavorites))
  }

  const filteredEspecies = especies.filter((especie) => {
    const matchesSearch =
      searchQuery === "" ||
      especie.nombresComunes.some((nombreObj: { nombre: string }) =>
        nombreObj.nombre.toLowerCase().includes(searchQuery.toLowerCase()),
      ) ||
      especie.nombreCientifico.toLowerCase().includes(searchQuery.toLowerCase()) ||
      especie.descripcion.toLowerCase().includes(searchQuery.toLowerCase())

    let matchesFilter = true
    switch (selectedFilter) {
      case "favorites":
        matchesFilter = favorites.includes(especie.id)
        break
      case "predator":
        matchesFilter = especie.descripcion.toLowerCase().includes("depredador")
        break
      case "sea":
        const palabras = especie.descripcion.toLowerCase().split(/[\s,.:;()""'/\-]+/)
        const terminosMarinos = [
          "mar",
          "marino",
          "marina",
          "marinos",
          "marinas",
          "océano",
          "océanos",
          "oceánico",
          "oceánica",
          "marítimo",
          "marítima",
          "marítimos",
          "marítimas",
          "costera",
          "costeras",
          "costero",
          "costeros"
        ]
        matchesFilter = palabras.some(palabra => terminosMarinos.includes(palabra))
        break
      case "river":
        matchesFilter = especie.descripcion.toLowerCase().includes("río")
        break
      case "lake":
        matchesFilter = especie.descripcion.toLowerCase().includes("laguna")
        break
    }

    return matchesSearch && matchesFilter
  })

  const extractMainName = (descripcion: string) => {
    const match = descripcion.match(/^([^:]+):/)
    return match ? match[1] : "Especie"
  }

  const extractShortDescription = (descripcion: string) => {
    const afterColon = descripcion.split(":")[1]
    if (!afterColon) return descripcion.substring(0, 100) + "..."

    const sentences = afterColon.split(".")
    return sentences.slice(0, 2).join(".") + (sentences.length > 2 ? "..." : "")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        {isMobile && <MobileNavigationBar />}
        <NavigationBar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Fish className="w-12 h-12 text-primary mx-auto animate-pulse" />
            <p className="text-muted-foreground mt-4">Cargando especies...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen bg-background"
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
        className="container mx-auto px-4 py-4 sm:py-8 max-w-7xl"
        style={
          isMobile
            ? {
                paddingTop: "max(72px, calc(72px + env(safe-area-inset-top)))",
              }
            : {}
        }
      >
        {/* Back button for mobile */}
        {isMobile && (
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-3 px-3 py-2 bg-card rounded-lg shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium text-foreground">Volver</span>
          </button>
        )}

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">Guía de Especies</h1>
          <p className="text-muted-foreground text-sm sm:text-base mt-1">
            Descubrí las especies, artes de pesca y carnadas de nuestros ríos, lagunas y mares
          </p>
        </div>

        {/* Banner destacado para sugerencias y aportes */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/15 via-card to-emerald-500/10 border border-primary/25 p-4 sm:p-5 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/20 text-primary text-[11px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                Comunidad Pescadora
              </div>
              <h2 className="text-sm sm:text-base font-bold text-foreground">
                ¿Conocés un pez, carnada o modalidad que falta en la guía?
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Aportá tu conocimiento. Nuestra Inteligencia Artificial buscará y armará la ficha técnica completa al instante.
              </p>
            </div>
            <button
              onClick={() => {
                setSugerirInitialNombre("");
                setIsSugerirOpen(true);
              }}
              className="shrink-0 inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-extrabold uppercase tracking-wider shadow-md shadow-primary/20 transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              + Sugerir Especie / Carnada
            </button>
          </div>
        </div>

        <div className="mb-4 sm:mb-8 space-y-3 sm:space-y-4">
          {/* Search bar */}
          <div className="relative max-w-md mx-auto">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground ${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
            <input
              type="text"
              placeholder="Buscar especies..."
              className={`w-full bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground ${
                isMobile ? 'pl-9 pr-3 py-2 text-sm' : 'pl-10 pr-4 py-3 text-base'
              }`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filters - horizontal scroll on mobile */}
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar">
            <div className="flex sm:flex-wrap sm:justify-center gap-2 min-w-max sm:min-w-0">
              {filters.map((filter) => {
                const Icon = filter.icon
                return (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter.id)}
                    className={`flex items-center space-x-2 rounded-lg transition-all whitespace-nowrap ${
                      isMobile ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm sm:text-base'
                    } ${
                      selectedFilter === filter.id
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-card hover:bg-accent text-foreground border border-border"
                    }`}
                  >
                    <Icon className={`flex-shrink-0 ${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
                    <span>{filter.name}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="text-center mb-3 sm:mb-6">
          <p className="text-muted-foreground text-xs sm:text-base">{filteredEspecies.length} especies encontradas</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {filteredEspecies.map((especie) => (
            <div
              key={especie.id}
              className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer active:scale-95"
              onClick={() => navigate(`/especie/${especie.id}`)}
            >
              {/* Image */}
              <div className={`relative bg-muted ${isMobile ? 'h-36' : 'h-40 sm:h-48'}`}>
                <ImagenResponsive
                  src={especie.imagen || "/placeholder-fish.png"}
                  alt={extractMainName(especie.descripcion)}
                  aspectRatio="auto"
                  objectFit="contain"
                  className="w-full h-full"
                />

                {/* Favorite button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFavorite(especie.id)
                  }}
                  className={`absolute top-2 right-2 rounded-full transition-all active:scale-90 ${
                    isMobile ? 'p-1.5' : 'p-2'
                  } ${
                    favorites.includes(especie.id)
                      ? "bg-red-500 text-white"
                      : "bg-black/50 text-white hover:bg-black/70"
                  }`}
                >
                  <Heart className={`${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} ${favorites.includes(especie.id) ? "fill-current" : ""}`} />
                </button>
              </div>

              {/* Content */}
              <div className={`${isMobile ? 'p-3' : 'p-3 sm:p-4'}`}>
                <h3 className={`font-bold text-foreground mb-1 line-clamp-1 ${isMobile ? 'text-sm' : 'text-base sm:text-lg'}`}>
                  {extractMainName(especie.descripcion)}
                </h3>

                <p className={`text-muted-foreground italic mb-2 line-clamp-1 ${isMobile ? 'text-xs' : 'text-xs sm:text-sm'}`}>
                  {especie.nombreCientifico}
                </p>

                <p className={`text-foreground mb-3 ${isMobile ? 'text-xs line-clamp-2' : 'text-xs sm:text-sm line-clamp-2 sm:line-clamp-3'}`}>
                  {extractShortDescription(especie.descripcion)}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {especie.nombresComunes?.slice(0, isMobile ? 2 : 3).map(
                    (
                      nombreObj: {
                        nombre:
                          | string
                          | number
                          | bigint
                          | boolean
                          | React.ReactElement<unknown, string | React.JSXElementConstructor<any>>
                          | Iterable<React.ReactNode>
                          | React.ReactPortal
                          | Promise<
                              | string
                              | number
                              | bigint
                              | boolean
                              | React.ReactPortal
                              | React.ReactElement<unknown, string | React.JSXElementConstructor<any>>
                              | Iterable<React.ReactNode>
                              | null
                              | undefined
                            >
                          | null
                          | undefined
                      },
                      index: React.Key | null | undefined,
                    ) => (
                      <span
                        key={index}
                        className={`bg-primary/10 text-primary rounded-full line-clamp-1 ${isMobile ? 'px-2 py-0.5 text-[10px]' : 'px-2 py-1 text-xs'}`}
                      >
                        {nombreObj.nombre}
                      </span>
                    ),
                  )}
                  {especie.nombresComunes && especie.nombresComunes.length > (isMobile ? 2 : 3) && (
                    <span className={`bg-muted text-muted-foreground rounded-full ${isMobile ? 'px-2 py-0.5 text-[10px]' : 'px-2 py-1 text-xs'}`}>
                      +{especie.nombresComunes.length - (isMobile ? 2 : 3)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state con invitación a sugerir */}
        {filteredEspecies.length === 0 && (
          <div className="text-center py-10 px-4 max-w-md mx-auto bg-card rounded-3xl border border-border/80 p-6 shadow-sm space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-inner">
              <Fish className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-foreground text-base sm:text-lg">
                {searchQuery ? `No encontramos "${searchQuery}"` : "No se encontraron especies"}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {searchQuery
                  ? "¿Es un pez que debería estar en la app? ¡Sugerilo con un toque y la IA generará la ficha técnica completa!"
                  : "Probá cambiando los filtros de búsqueda o proponé una especie que falte."}
              </p>
            </div>
            {searchQuery && (
              <button
                onClick={() => {
                  setSugerirInitialNombre(searchQuery);
                  setIsSugerirOpen(true);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider shadow-md hover:bg-primary/90 transition-all active:scale-95 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                Sugerir "{searchQuery}" ahora
              </button>
            )}
          </div>
        )}
      </div>

      {/* Floating Action Button (FAB) para sugerir desde cualquier parte del scroll */}
      <button
        onClick={() => {
          setSugerirInitialNombre("");
          setIsSugerirOpen(true);
        }}
        className="fixed bottom-24 right-4 sm:bottom-8 sm:right-8 z-40 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-primary to-emerald-600 text-white rounded-full shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all font-bold text-xs sm:text-sm backdrop-blur-md border border-white/20 cursor-pointer"
        title="Sugerir nueva especie, modalidad o carnada con IA"
      >
        <Sparkles className="w-4 h-4 animate-bounce" />
        <span className="hidden sm:inline">Sugerir con IA</span>
        <span className="sm:hidden">Sugerir</span>
      </button>

      <SugerirModal
        isOpen={isSugerirOpen}
        initialNombre={sugerirInitialNombre}
        onClose={() => setIsSugerirOpen(false)}
      />
    </div>
  );
};

export default GuiaEspecies;