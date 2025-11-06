import React, { useState } from "react"
import { Search, Heart, Fish, MapPin, Zap, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import NavigationBar from "../common/NavigationBar"
import { useEspecies } from "../../hooks/especies/useEspecies"
import MobileNavigationBar from "../common/MobileNavigationBar"
import { useIsMobile } from "../../hooks/useIsMobile"

const obtenerUrlImagenEspecie = (imagen?: string) => {
  if (!imagen) return "/placeholder-fish.png"
  if (imagen.startsWith("http")) return imagen
  return `${import.meta.env.VITE_API_URL}/${imagen}`
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
      (especie.nombre_comun &&
        especie.nombresComunes.some((nombreObj: { nombre: string }) =>
          nombreObj.nombre.toLowerCase().includes(searchQuery.toLowerCase()),
        )) ||
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
    <div className="min-h-screen bg-background pb-safe">
      {isMobile && <MobileNavigationBar />}
      <NavigationBar />

      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-7xl">
        {/* Back button for mobile */}
        {isMobile && (
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-4 px-4 py-2 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <ArrowLeft className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-foreground">Volver</span>
          </button>
        )}

        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">Guía de Especies</h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            Descubre todo sobre los peces de nuestros ríos y lagunas
          </p>
        </div>

        <div className="mb-6 sm:mb-8 space-y-4">
          {/* Search bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar especies..."
              className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-foreground text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filters - horizontal scroll on mobile */}
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="flex sm:flex-wrap sm:justify-center gap-2 min-w-max sm:min-w-0">
              {filters.map((filter) => {
                const Icon = filter.icon
                return (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                      selectedFilter === filter.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-card hover:bg-accent text-foreground border border-border"
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm sm:text-base">{filter.name}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="text-center mb-4 sm:mb-6">
          <p className="text-muted-foreground text-sm sm:text-base">{filteredEspecies.length} especies encontradas</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredEspecies.map((especie) => (
            <div
              key={especie.id}
              className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/especie/${especie.id}`)}
            >
              {/* Image */}
              <div className="relative h-40 sm:h-48 bg-muted">
                <img
                  src={obtenerUrlImagenEspecie(especie.imagen) || "/placeholder.svg"}
                  alt={extractMainName(especie.descripcion)}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src = "/placeholder-fish.png"
                  }}
                />

                {/* Favorite button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFavorite(especie.id)
                  }}
                  className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${
                    favorites.includes(especie.id)
                      ? "bg-red-500 text-white"
                      : "bg-black/50 text-white hover:bg-black/70"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${favorites.includes(especie.id) ? "fill-current" : ""}`} />
                </button>
              </div>

              {/* Content */}
              <div className="p-3 sm:p-4">
                <h3 className="text-base sm:text-lg font-bold text-foreground mb-1 line-clamp-1">
                  {extractMainName(especie.descripcion)}
                </h3>

                <p className="text-xs sm:text-sm text-muted-foreground italic mb-2 line-clamp-1">
                  {especie.nombreCientifico}
                </p>

                <p className="text-xs sm:text-sm text-foreground mb-3 line-clamp-2 sm:line-clamp-3">
                  {extractShortDescription(especie.descripcion)}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {especie.nombresComunes?.slice(0, 3).map(
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
                        className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full line-clamp-1"
                      >
                        {nombreObj.nombre}
                      </span>
                    ),
                  )}
                  {especie.nombresComunes && especie.nombresComunes.length > 3 && (
                    <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-full">
                      +{especie.nombresComunes.length - 3}
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
            <Fish className="w-12 sm:w-16 h-12 sm:h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-foreground mb-2">No se encontraron especies</h3>
            <p className="text-sm sm:text-base text-muted-foreground">
              Prueba con otros términos de búsqueda o filtros
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default GuiaEspecies