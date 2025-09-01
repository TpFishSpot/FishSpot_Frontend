import type React from "react"
import { useState } from "react"
import { MapPin, Plus, Menu, X, Search, User, Settings, HelpCircle, Fish, Sun, Moon, Monitor, Camera } from "lucide-react"
import { useNavigate } from "react-router-dom"
import UserMenu from "./UserMenu"
import { useAuth } from "../contexts/AuthContext"
import { useTheme } from "../contexts/ThemeContext"

interface NavigationBarProps {
  onCreateSpotClick?: () => void
  onSearch?: (query: string) => void
  className?: string
}

const NavigationBar: React.FC<NavigationBarProps> = ({ onCreateSpotClick, onSearch, className = "" }) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleCreateSpot = () => {
    if (!user) {
      navigate("/login")
      return
    }
    if (onCreateSpotClick) {
      onCreateSpotClick()
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim())
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)

    if (onSearch) {
      onSearch(e.target.value)
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <>
      <div className={`bg-background/95 backdrop-blur-sm shadow-lg border-b border-border relative z-50 ${className}`}>
        <div className="w-full px-2 sm:px-3">
          <div className="flex items-center justify-between h-16">
            {/* Left: Hamburger Menu and Logo - pegados a la izquierda */}
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMenu}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="w-6 h-6 text-foreground" /> : <Menu className="w-6 h-6 text-foreground" />}
              </button>

              {/* Logo */}
              <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate("/")}>
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">FishSpot</span>
              </div>
            </div>

            {/* Center: Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Buscar por especie, nombre o localidad..."
                    className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent text-foreground placeholder-muted-foreground"
                  />
                </div>
              </form>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleCreateSpot}
                className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg transition font-medium"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Crear Spot</span>
              </button>

              {user && (
                <button
                  onClick={() => navigate("/spots/pendientes")}
                  className="flex items-center space-x-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground px-4 py-2 rounded-lg transition font-medium"
                >
                  <span className="hidden sm:inline">Pendientes</span>
                  <span className="sm:hidden">P</span>
                </button>
              )}

              <UserMenu />
            </div>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 z-[100]">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={toggleMenu} />

          {/* Menu Panel */}
          <div className="fixed left-0 top-0 h-full w-80 bg-background border-r border-border shadow-xl">
            <div className="flex flex-col h-full">
              {/* Menu Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <span className="text-lg font-bold text-foreground">FishSpot</span>
                </div>
                <button onClick={toggleMenu} className="p-2 rounded-lg hover:bg-muted transition-colors">
                  <X className="w-5 h-5 text-foreground" />
                </button>
              </div>

              {/* Menu Items */}
              <nav className="flex-1 p-4 space-y-2">
                {!user && (
                  <button
                    onClick={() => {
                      navigate("/login")
                      toggleMenu()
                    }}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors text-left bg-primary text-primary-foreground"
                  >
                    <User className="w-5 h-5" />
                    <span>Iniciar Sesión</span>
                  </button>
                )}

                {user && (
                  <>
                    <button
                      onClick={() => {
                        navigate("/profile")
                        toggleMenu()
                      }}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
                    >
                      <User className="w-5 h-5 text-foreground" />
                      <span className="text-foreground">Mi Perfil</span>
                    </button>

                    <button
                      onClick={() => {
                        navigate("/my-spots")
                        toggleMenu()
                      }}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
                    >
                      <MapPin className="w-5 h-5 text-foreground" />
                      <span className="text-foreground">Mis Spots</span>
                    </button>

                    <button
                      onClick={() => {
                        navigate("/mis-capturas")
                        toggleMenu()
                      }}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
                    >
                      <Camera className="w-5 h-5 text-foreground" />
                      <span className="text-foreground">Mis Capturas</span>
                    </button>
                  </>
                )}

                <button
                  onClick={() => {
                    navigate("/especies-guide")
                    toggleMenu()
                  }}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
                >
                  <Fish className="w-5 h-5 text-foreground" />
                  <span className="text-foreground">Guía de Especies</span>
                </button>

                <button
                  onClick={() => {
                    navigate("/settings")
                    toggleMenu()
                  }}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
                >
                  <Settings className="w-5 h-5 text-foreground" />
                  <span className="text-foreground">Configuración</span>
                </button>

                {/* Theme Switch */}
                <div className="border-t border-border my-2 pt-2">
                  <div className="px-3 py-2 text-xs font-semibold text-foreground uppercase tracking-wider">
                    Tema
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
                    <div className="flex items-center space-x-3">
                      {theme === 'light' && <Sun className="w-5 h-5 text-foreground" />}
                      {theme === 'dark' && <Moon className="w-5 h-5 text-foreground" />}
                      {theme === 'system' && <Monitor className="w-5 h-5 text-foreground" />}
                      <span className="text-foreground capitalize">
                        {theme === 'system' ? 'Sistema' : theme === 'dark' ? 'Oscuro' : 'Claro'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => setTheme('light')}
                        className={`p-1.5 rounded-md transition-colors ${theme === 'light' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                        title="Tema Claro"
                      >
                        <Sun className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setTheme('dark')}
                        className={`p-1.5 rounded-md transition-colors ${theme === 'dark' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                        title="Tema Oscuro"
                      >
                        <Moon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setTheme('system')}
                        className={`p-1.5 rounded-md transition-colors ${theme === 'system' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                        title="Tema del Sistema"
                      >
                        <Monitor className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    navigate("/help")
                    toggleMenu()
                  }}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
                >
                  <HelpCircle className="w-5 h-5 text-foreground" />
                  <span className="text-foreground">Ayuda</span>
                </button>
              </nav>

              {/* Menu Footer */}
              {user && (
                <div className="p-4 border-t border-border">
                  <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{user.email || "Usuario"}</p>
                      <p className="text-xs text-muted-foreground">Pescador activo</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default NavigationBar
