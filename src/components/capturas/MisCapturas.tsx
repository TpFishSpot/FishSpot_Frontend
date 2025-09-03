import React, { useState, useEffect } from 'react'
import { Camera, Plus, Edit3, Trash2, Fish, Trophy, Weight, TrendingUp, Filter, Calendar, MapPin, Ruler } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useCapturas } from '../../hooks/capturas/useCapturas'
import FormularioCaptura from './FormularioCaptura'
import type { NuevaCapturaData, Captura } from '../../api/capturasApi'
import { buildImageUrl } from '../../utils/imageUtils'

const formatNumber = (num: number | undefined | null, decimals = 1): string => {
  return (num || 0).toFixed(decimals);
}

const safeNumber = (value: any): number => {
  const num = parseFloat(value);
  return isNaN(num) ? 0 : num;
}

const isValidNumber = (value: any): boolean => {
  const num = parseFloat(value);
  return !isNaN(num) && num > 0;
}

const MisCapturas: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { capturas, loading, error, loadCapturas, agregarCaptura, borrarCaptura } = useCapturas()
  const [showAddModal, setShowAddModal] = useState(false)
  const [filtroEspecie, setFiltroEspecie] = useState<string>('all')

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    loadCapturas()
  }, [user])

  const handleSaveCaptura = async (nuevaCaptura: NuevaCapturaData) => {
    await agregarCaptura(nuevaCaptura)
    setShowAddModal(false)
  }

  const handleDeleteCaptura = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta captura?')) {
      await borrarCaptura(id)
    }
  }

  const especies = ['Dorado', 'Tararira', 'Surubí', 'Pacú', 'Boga', 'Bagre', 'Pejerrey', 'Trucha']

  const obtenerNombreEspecie = (captura: Captura) =>
    captura.especie?.nombresComunes?.[0]?.nombre ||
    captura.especie?.nombresComunes?.[0] ||
    captura.especieId ||
    'Desconocida'

  const filteredCapturas = capturas.filter(
    (c) => filtroEspecie === 'all' || obtenerNombreEspecie(c) === filtroEspecie
  )

  const totalCapturas = capturas.length
  const especiesCapturadas = new Set(capturas.map((c) => obtenerNombreEspecie(c))).size
  const pesoTotal = capturas.reduce((sum, c) => sum + safeNumber(c.peso), 0)
  const mayorCaptura = capturas
    .filter((c) => isValidNumber(c.peso))
    .reduce((max, c) => (safeNumber(c.peso) > safeNumber(max?.peso) ? c : max), capturas.find((c) => isValidNumber(c.peso)))

  const capturasPorMes = capturas.filter((c) => {
    const fecha = new Date(c.fecha)
    const hoy = new Date()
    return fecha.getMonth() === hoy.getMonth() && fecha.getFullYear() === hoy.getFullYear()
  }).length

  const especieFavorita = capturas.reduce((acc, c) => {
    const nombre = obtenerNombreEspecie(c)
    acc[nombre] = (acc[nombre] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const especieMasCapturada = Object.keys(especieFavorita).reduce(
    (a, b) => (especieFavorita[a] > especieFavorita[b] ? a : b),
    Object.keys(especieFavorita)[0] || 'N/A'
  )

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
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">🎣 Mi Estanque</h1>
          <p className="text-muted-foreground text-lg">Tu diario personal de pesca</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <Fish className="w-8 h-8 text-primary mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-foreground">{totalCapturas}</h3>
            <p className="text-muted-foreground">Total Capturas</p>
            <div className="mt-2 text-xs text-muted-foreground">{capturasPorMes} este mes</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <Trophy className="w-8 h-8 text-secondary mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-foreground">{especiesCapturadas}</h3>
            <p className="text-muted-foreground">Especies Diferentes</p>
            <div className="mt-2 text-xs text-muted-foreground">Favorita: {especieMasCapturada}</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <Weight className="w-8 h-8 text-accent mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-foreground">{formatNumber(pesoTotal, 1)} kg</h3>
            <p className="text-muted-foreground">Peso Total</p>
            <div className="mt-2 text-xs text-muted-foreground">
              Promedio: {totalCapturas > 0 ? formatNumber(pesoTotal / totalCapturas, 1) : 0} kg
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <TrendingUp className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-foreground">{formatNumber(mayorCaptura?.peso || 0, 1)} kg</h3>
            <p className="text-muted-foreground">Mayor Captura</p>
            <div className="mt-2 text-xs text-muted-foreground">
              {mayorCaptura ? obtenerNombreEspecie(mayorCaptura) : 'N/A'}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={filtroEspecie}
              onChange={(e) => setFiltroEspecie(e.target.value)}
              className="px-3 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
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
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            <span>Nueva Captura</span>
          </button>
        </div>

        {filteredCapturas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCapturas.map((c) => (
              <div key={c.id} className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative h-48 bg-muted">
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
                    <Camera className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <button
                      onClick={() => alert('Función de editar próximamente disponible')}
                      className="p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => c.id && handleDeleteCaptura(c.id)}
                      className="p-1 bg-black/50 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-foreground">{obtenerNombreEspecie(c)}</h3>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{c.tipoPesca}</span>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(c.fecha).toLocaleDateString()}</span>
                      {c.horaCaptura && <span>- {c.horaCaptura}</span>}
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{c.ubicacion}</span>
                    </div>
                    {(isValidNumber(c.peso) || isValidNumber(c.longitud)) && (
                      <div className="flex items-center space-x-4">
                        {isValidNumber(c.peso) && (
                          <div className="flex items-center space-x-1">
                            <Weight className="w-4 h-4" />
                            <span>{formatNumber(c.peso, 1)} kg</span>
                          </div>
                        )}
                        {isValidNumber(c.longitud) && (
                          <div className="flex items-center space-x-1">
                            <Ruler className="w-4 h-4" />
                            <span>{formatNumber(c.longitud, 1)} cm</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-1">Carnada:</p>
                    <p className="text-sm text-foreground font-medium">{c.carnada}</p>
                  </div>
                  {c.notas && (
                    <div className="mt-2">
                      <p className="text-sm text-foreground italic line-clamp-2">"{c.notas}"</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Fish className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {filtroEspecie === 'all' ? 'No tienes capturas registradas' : `No tienes capturas de ${filtroEspecie}`}
            </h3>
            <p className="text-muted-foreground mb-6">¡Comienza registrando tu primera captura!</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center space-x-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              <span>Nueva Captura</span>
            </button>
          </div>
        )}

        <FormularioCaptura isOpen={showAddModal} onClose={() => setShowAddModal(false)} onSave={handleSaveCaptura} />
      </div>
    </div>
  )
}

export default MisCapturas
