import React, { useState, useEffect } from 'react'
import { Camera, Plus, Edit3, Trash2, Fish, Trophy, Weight, TrendingUp, Filter, Calendar, MapPin, Ruler } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useCapturas } from '../../hooks/capturas/useCapturas'
import type { Captura } from '../../modelo/Captura'
import { buildImageUrl } from '../../utils/imageUtils'
import { PullToRefresh } from '../ui/PullToRefresh'
import NavigationBar from '../common/NavigationBar'
import MobileNavigationBar from '../common/MobileNavigationBar'
import { useIsMobile } from '../../hooks/useIsMobile'

const formatNumber = (num: number | undefined | null, decimals = 1): string => {
  if (num === undefined || num === null) return '0';
  const safeNum = parseFloat(String(num));
  if (isNaN(safeNum) || !isFinite(safeNum)) return '0';
  return safeNum.toFixed(decimals);
}

const safeNumber = (value: any): number => {
  if (value === undefined || value === null || value === '') return 0;
  const num = parseFloat(String(value));
  return isNaN(num) || !isFinite(num) ? 0 : num;
}

const isValidNumber = (value: any): boolean => {
  if (value === undefined || value === null || value === '') return false;
  const num = parseFloat(String(value));
  return !isNaN(num) && isFinite(num) && num > 0;
}

const MisCapturas: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { capturas, loading, error, loadCapturas, borrarCaptura } = useCapturas()
  const [filtroEspecie, setFiltroEspecie] = useState<string>('all')
  const isMobile = useIsMobile()

  const normalizeCapturaData = (captura: Captura): Captura => {
    return {
      ...captura,
      peso: captura.peso ? parseFloat(String(captura.peso)) : undefined,
      longitud: captura.longitud ? parseFloat(String(captura.longitud)) : undefined
    }
  }

  const capturasNormalizadas = (capturas || []).map(normalizeCapturaData)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    loadCapturas()
  }, [user])

  const handleDeleteCaptura = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta captura?')) {
      await borrarCaptura(id)
    }
  }

  const obtenerNombreEspecie = (captura: Captura) =>
    captura.especie?.nombresComunes?.[0]?.nombre ||
    captura.especie?.nombresComunes?.[0] ||
    captura.especieId ||
    'Desconocida'

  const filteredCapturas = capturasNormalizadas.filter(
    (c) => filtroEspecie === 'all' || obtenerNombreEspecie(c) === filtroEspecie
  )

  const totalCapturas = capturasNormalizadas.length
  const especiesCapturadas = new Set(capturasNormalizadas.map((c) => obtenerNombreEspecie(c))).size
  const pesoTotal = capturasNormalizadas.reduce((sum, c) => sum + safeNumber(c.peso), 0)
  const mayorCaptura = capturasNormalizadas
    .filter((c) => isValidNumber(c.peso))
    .reduce((max, c) => (safeNumber(c.peso) > safeNumber(max?.peso) ? c : max), capturasNormalizadas.find((c) => isValidNumber(c.peso)))

  const capturasPorMes = capturasNormalizadas.filter((c) => {
    const fecha = new Date(c.fecha)
    const hoy = new Date()
    return fecha.getMonth() === hoy.getMonth() && fecha.getFullYear() === hoy.getFullYear()
  }).length

  const especieFavorita = capturasNormalizadas.reduce((acc, c) => {
    const nombre = obtenerNombreEspecie(c)
    acc[nombre] = (acc[nombre] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const especieMasCapturada = Object.keys(especieFavorita).length > 0 
    ? Object.keys(especieFavorita).reduce(
        (a, b) => (especieFavorita[a] > especieFavorita[b] ? a : b),
        Object.keys(especieFavorita)[0]
      )
    : 'N/A'

  const especies = [...new Set(capturasNormalizadas.map(c => obtenerNombreEspecie(c)))].sort()

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center">
          <Fish className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Cargando capturas...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center text-red-500">
          <p>Error: {error}</p>
          <button onClick={loadCapturas} className="mt-4 bg-primary text-primary-foreground px-4 py-2 rounded">
            Reintentar
          </button>
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
        className={`max-w-7xl mx-auto ${isMobile ? 'px-3 py-4' : 'px-4 sm:px-6 lg:px-8 py-8'}`}
        style={
          isMobile
            ? {
                paddingTop: "max(76px, calc(76px + env(safe-area-inset-top)))",
              }
            : {}
        }
      >
        <PullToRefresh onRefresh={loadCapturas}>
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

          <div className={`text-center ${isMobile ? 'mb-4' : 'mb-8'}`}>
            <h1 className={`font-bold text-foreground ${isMobile ? 'text-2xl mb-1' : 'text-4xl mb-2'}`}>Mi Estanque</h1>
            <p className={`text-muted-foreground ${isMobile ? 'text-sm' : 'text-lg'}`}>Tu diario personal de pesca</p>
          </div>

          <div className={`grid grid-cols-2 lg:grid-cols-4 ${isMobile ? 'gap-2 mb-4' : 'gap-6 mb-8'}`}>
            <div className={`bg-card border border-border rounded-lg text-center ${isMobile ? 'p-3' : 'p-6'}`}>
              <Fish className={`text-primary mx-auto ${isMobile ? 'w-6 h-6 mb-1' : 'w-8 h-8 mb-2'}`} />
              <h3 className={`font-bold text-foreground ${isMobile ? 'text-lg' : 'text-2xl'}`}>{totalCapturas}</h3>
              <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-base'}`}>Total Capturas</p>
              <div className={`mt-1 text-muted-foreground ${isMobile ? 'text-[10px]' : 'text-xs'}`}>{capturasPorMes} este mes</div>
            </div>
            <div className={`bg-card border border-border rounded-lg text-center ${isMobile ? 'p-3' : 'p-6'}`}>
              <Trophy className={`text-secondary mx-auto ${isMobile ? 'w-6 h-6 mb-1' : 'w-8 h-8 mb-2'}`} />
              <h3 className={`font-bold text-foreground ${isMobile ? 'text-lg' : 'text-2xl'}`}>{especiesCapturadas}</h3>
              <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-base'}`}>Especies</p>
              <div className={`mt-1 text-muted-foreground ${isMobile ? 'text-[10px] truncate' : 'text-xs'}`}>
                {isMobile ? especieMasCapturada.substring(0, 10) + (especieMasCapturada.length > 10 ? '...' : '') : `Favorita: ${especieMasCapturada}`}
              </div>
            </div>
            <div className={`bg-card border border-border rounded-lg text-center ${isMobile ? 'p-3' : 'p-6'}`}>
              <Weight className={`text-accent mx-auto ${isMobile ? 'w-6 h-6 mb-1' : 'w-8 h-8 mb-2'}`} />
              <h3 className={`font-bold text-foreground ${isMobile ? 'text-lg' : 'text-2xl'}`}>{formatNumber(pesoTotal, 1)} kg</h3>
              <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-base'}`}>Peso Total</p>
              <div className={`mt-1 text-muted-foreground ${isMobile ? 'text-[10px]' : 'text-xs'}`}>
                Prom: {totalCapturas > 0 && pesoTotal > 0 ? formatNumber(pesoTotal / totalCapturas, 1) : '0'} kg
              </div>
            </div>
            <div className={`bg-card border border-border rounded-lg text-center ${isMobile ? 'p-3' : 'p-6'}`}>
              <TrendingUp className={`text-orange-500 mx-auto ${isMobile ? 'w-6 h-6 mb-1' : 'w-8 h-8 mb-2'}`} />
              <h3 className={`font-bold text-foreground ${isMobile ? 'text-lg' : 'text-2xl'}`}>{formatNumber(mayorCaptura?.peso || 0, 1)} kg</h3>
              <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-base'}`}>Mayor</p>
              <div className={`mt-1 text-muted-foreground ${isMobile ? 'text-[10px] truncate' : 'text-xs'}`}>
                {mayorCaptura ? obtenerNombreEspecie(mayorCaptura).substring(0, isMobile ? 10 : 20) : 'N/A'}
              </div>
            </div>
          </div>

          <div className={`flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 ${isMobile ? 'gap-2' : 'gap-4'}`}>
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Filter className={`text-muted-foreground flex-shrink-0 ${isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
              <select
                value={filtroEspecie}
                onChange={(e) => setFiltroEspecie(e.target.value)}
                className={`flex-1 sm:flex-none bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                  isMobile ? 'px-2 py-1.5 text-sm' : 'px-3 py-2'
                }`}
              >
                <option value="all">Todas las especies</option>
                {especies.map((especie) => (
                  <option key={especie} value={especie}>
                    {especie}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => navigate('/nueva-captura')}
              className={`flex items-center justify-center space-x-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-all font-medium w-full sm:w-auto active:scale-95 ${
                isMobile ? 'px-4 py-2 text-sm' : 'px-6 py-3'
              }`}
            >
              <Plus className={isMobile ? 'w-4 h-4' : 'w-5 h-5'} />
              <span>Nueva Captura</span>
            </button>
          </div>

          {filteredCapturas.length > 0 ? (
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 ${isMobile ? 'gap-3' : 'gap-6'}`}>
              {filteredCapturas.map((c) => (
                <div 
                  key={c.id} 
                  onClick={() => navigate(`/capturas/${c.id}`)}
                  className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer active:scale-95"
                >
                  <div className={`relative bg-muted ${isMobile ? 'h-40' : 'h-48'}`}>
                    {c.foto ? (
                      <img
                        src={buildImageUrl(c.foto)}
                        alt={obtenerNombreEspecie(c)}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                          if (e.currentTarget.parentElement) {
                            const fallback = e.currentTarget.parentElement.querySelector('.fallback-icon')
                            if (fallback) (fallback as HTMLElement).style.display = 'flex'
                          }
                        }}
                      />
                    ) : null}
                    <div className="fallback-icon w-full h-full flex items-center justify-center" style={{ display: c.foto ? 'none' : 'flex' }}>
                      <Camera className={`text-muted-foreground ${isMobile ? 'w-10 h-10' : 'w-12 h-12'}`} />
                    </div>
                    <div className={`absolute top-2 right-2 flex ${isMobile ? 'space-x-1' : 'space-x-1'}`}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          alert('Función de editar próximamente disponible')
                        }}
                        className={`bg-black/50 text-white rounded-full hover:bg-black/70 transition-all active:scale-90 ${isMobile ? 'p-1' : 'p-1'}`}
                      >
                        <Edit3 className={isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          c.id && handleDeleteCaptura(c.id)
                        }}
                        className={`bg-black/50 text-white rounded-full hover:bg-red-600 transition-all active:scale-90 ${isMobile ? 'p-1' : 'p-1'}`}
                      >
                        <Trash2 className={isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
                      </button>
                    </div>
                  </div>
                  <div className={isMobile ? 'p-3' : 'p-4'}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={`font-bold text-foreground ${isMobile ? 'text-sm' : 'text-lg'}`}>{obtenerNombreEspecie(c)}</h3>
                      <span className={`bg-primary/10 text-primary px-2 py-1 rounded-full whitespace-nowrap ${isMobile ? 'text-[10px]' : 'text-xs'}`}>{c.tipoPesca}</span>
                    </div>
                    <div className={`space-y-1.5 text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
                      <div className="flex items-center space-x-2">
                        <Calendar className={isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
                        <span>{new Date(c.fecha).toLocaleDateString()}</span>
                        {c.horaCaptura && <span>- {c.horaCaptura}</span>}
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className={isMobile ? 'w-3.5 h-3.5 flex-shrink-0' : 'w-4 h-4'} />
                        <span className="truncate">{c.ubicacion}</span>
                      </div>
                      {(isValidNumber(c.peso) || isValidNumber(c.longitud)) && (
                        <div className="flex items-center space-x-3">
                          {isValidNumber(c.peso) && (
                            <div className="flex items-center space-x-1">
                              <Weight className={isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
                              <span>{formatNumber(c.peso, 1)} kg</span>
                            </div>
                          )}
                          {isValidNumber(c.longitud) && (
                            <div className="flex items-center space-x-1">
                              <Ruler className={isMobile ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
                              <span>{formatNumber(c.longitud, 1)} cm</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className={`pt-2 border-t border-border ${isMobile ? 'mt-2' : 'mt-3'}`}>
                      <p className={`text-muted-foreground mb-1 ${isMobile ? 'text-[10px]' : 'text-xs'}`}>Carnada:</p>
                      <p className={`text-foreground font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>{c.carnada}</p>
                    </div>
                    {c.notas && (
                      <div className="mt-2">
                        <p className={`text-foreground italic line-clamp-2 ${isMobile ? 'text-xs' : 'text-sm'}`}>"{c.notas}"</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Fish className={`text-muted-foreground mx-auto mb-4 ${isMobile ? 'w-12 h-12' : 'w-16 h-16'}`} />
              <h3 className={`font-semibold text-foreground mb-2 ${isMobile ? 'text-base' : 'text-xl'}`}>
                {filtroEspecie === 'all' ? 'No tienes capturas registradas' : `No tienes capturas de ${filtroEspecie}`}
              </h3>
              <p className={`text-muted-foreground ${isMobile ? 'text-sm mb-4' : 'mb-6'}`}>¡Comienza registrando tu primera captura!</p>
              <button
                onClick={() => navigate('/nueva-captura')}
                className={`inline-flex items-center space-x-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-all font-medium active:scale-95 ${
                  isMobile ? 'px-4 py-2 text-sm' : 'px-6 py-3'
                }`}
              >
                <Plus className={isMobile ? 'w-4 h-4' : 'w-5 h-5'} />
                <span>Nueva Captura</span>
              </button>
            </div>
          )}
        </PullToRefresh>
      </div>
    </div>
  )
}

export default MisCapturas
