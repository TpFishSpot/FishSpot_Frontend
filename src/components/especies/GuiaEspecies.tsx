import React, { useState } from "react"
import { Search, Heart, Fish, MapPin, Zap } from "lucide-react"
import { useNavigate } from "react-router-dom"
import NavigationBar from "../common/NavigationBar"
import { useEspecies } from "../../hooks/especies/useEspecies"
import MobileNavigationBar from "../common/MobileNavigationBar"
import { useIsMobile } from "../../hooks/useIsMobile"
import { baseApi } from "../../api/apiFishSpot"
import { ImagenResponsive } from "../common/imgenResponsive"

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
  const isMobile = useIsMobile()

  const filters = [
    { id: "all", name: "Todas", icon: Fish },
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
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-4xl font-bold text-foreground mb-2">Guía de Especies</h1>
          <p className="text-muted-foreground text-sm sm:text-lg">
            Descubre todo sobre los peces de nuestros ríos y lagunas
          </p>
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

        {/* Empty state */}
        {filteredEspecies.length === 0 && (
          <div className="text-center py-12">
            <Fish className={`text-muted-foreground mx-auto mb-4 ${isMobile ? 'w-12 h-12' : 'w-12 sm:w-16 h-12 sm:h-16'}`} />
            <h3 className={`font-medium text-foreground mb-2 ${isMobile ? 'text-sm' : 'text-base sm:text-lg'}`}>No se encontraron especies</h3>
            <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm sm:text-base'}`}>
              Prueba con otros términos de búsqueda o filtros
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default GuiaEspecies