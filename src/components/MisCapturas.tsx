import React, { useState, useEffect } from 'react'
import { Plus, Camera, Fish, Calendar, MapPin, Ruler, Weight, Edit3, Trash2, Filter, Trophy, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import NavigationBar from './NavigationBar'
import FormularioCaptura from './FormularioCaptura'
import { useAuth } from '../contexts/AuthContext'
import { useCapturas } from '../hooks/useCapturas'
import type { Captura, NuevaCapturaData } from '../api/capturasApi'

const MisCapturas: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { capturas, loading, loadCapturas, agregarCaptura, borrarCaptura } = useCapturas()
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
    try {
      await agregarCaptura(nuevaCaptura)
      setShowAddModal(false)
    } catch (error) {
      console.error('Error saving captura:', error)
    }
  }

  const handleDeleteCaptura = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta captura?')) {
      try {
        await borrarCaptura(id)
      } catch (error) {
        console.error('Error deleting captura:', error)
      }
    }
  }

  const especies = ['Dorado', 'Tararira', 'Surubí', 'Pacú', 'Boga', 'Bagre', 'Pejerrey', 'Trucha']

  const obtenerNombreEspecie = (captura: Captura) => {
    if (captura.especie?.nombresComunes?.[0]) {
      return captura.especie.nombresComunes[0].nombre || captura.especie.nombresComunes[0]
    }
    return captura.especieId || 'Desconocida'
  }

  const filteredCapturas = capturas.filter(captura => 
    filtroEspecie === 'all' || obtenerNombreEspecie(captura) === filtroEspecie
  )

  const totalCapturas = capturas.length
  const especiesCapturadas = [...new Set(capturas.map(c => obtenerNombreEspecie(c)))].length
  const pesoTotal = capturas.reduce((sum, c) => sum + (c.peso || 0), 0)
  const mayorCaptura = capturas.reduce((max, c) => 
    (c.peso || 0) > (max?.peso || 0) ? c : max, capturas[0])

  const capturasPorMes = capturas.filter(c => {
    const fecha = new Date(c.fecha)
    const hoy = new Date()
    return fecha.getMonth() === hoy.getMonth() && fecha.getFullYear() === hoy.getFullYear()
  }).length

  const especieFavorita = capturas.reduce((acc, captura) => {
    const nombreEspecie = obtenerNombreEspecie(captura)
    acc[nombreEspecie] = (acc[nombreEspecie] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const especieMasCapturada = Object.keys(especieFavorita).reduce(
    (a, b) => especieFavorita[a] > especieFavorita[b] ? a : b, 
    Object.keys(especieFavorita)[0] || 'N/A'
  )

  if (!user) return null

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <NavigationBar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Fish className="w-12 h-12 text-primary mx-auto animate-pulse" />
            <p className="text-muted-foreground mt-4">Cargando capturas...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            🎣 Mi Estanque
          </h1>
          <p className="text-muted-foreground text-lg">
            Tu diario personal de pesca
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <Fish className="w-8 h-8 text-primary mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-foreground">{totalCapturas}</h3>
            <p className="text-muted-foreground">Total Capturas</p>
            <div className="mt-2 text-xs text-muted-foreground">
              {capturasPorMes} este mes
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <Trophy className="w-8 h-8 text-secondary mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-foreground">{especiesCapturadas}</h3>
            <p className="text-muted-foreground">Especies Diferentes</p>
            <div className="mt-2 text-xs text-muted-foreground">
              Favorita: {especieMasCapturada}
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <Weight className="w-8 h-8 text-accent mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-foreground">{pesoTotal.toFixed(1)} kg</h3>
            <p className="text-muted-foreground">Peso Total</p>
            <div className="mt-2 text-xs text-muted-foreground">
              Promedio: {totalCapturas > 0 ? (pesoTotal / totalCapturas).toFixed(1) : 0} kg
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <TrendingUp className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-foreground">
              {mayorCaptura?.peso?.toFixed(1) || 0} kg
            </h3>
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
              {especies.map(especie => (
                <option key={especie} value={especie}>{especie}</option>
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
            {filteredCapturas.map((captura) => (
              <div
                key={captura.id}
                className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative h-48 bg-muted">
                  {captura.foto ? (
                    <img
                      src={captura.foto}
                      alt={obtenerNombreEspecie(captura)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Camera className="w-12 h-12 text-muted-foreground" />
                    </div>
                  )}
                  
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <button 
                      onClick={() => {
                        // TODO: Implementar edición
                        alert('Función de editar próximamente disponible')
                      }}
                      className="p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => captura.id && handleDeleteCaptura(captura.id)}
                      className="p-1 bg-black/50 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-foreground">
                      {obtenerNombreEspecie(captura)}
                    </h3>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {captura.tipoPesca}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(captura.fecha).toLocaleDateString()}</span>
                      {captura.horaCaptura && <span>- {captura.horaCaptura}</span>}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{captura.ubicacion}</span>
                    </div>

                    {(captura.peso || captura.longitud) && (
                      <div className="flex items-center space-x-4">
                        {captura.peso && (
                          <div className="flex items-center space-x-1">
                            <Weight className="w-4 h-4" />
                            <span>{captura.peso} kg</span>
                          </div>
                        )}
                        {captura.longitud && (
                          <div className="flex items-center space-x-1">
                            <Ruler className="w-4 h-4" />
                            <span>{captura.longitud} cm</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-1">Carnada:</p>
                    <p className="text-sm text-foreground font-medium">{captura.carnada}</p>
                  </div>

                  {captura.notas && (
                    <div className="mt-2">
                      <p className="text-sm text-foreground italic line-clamp-2">
                        "{captura.notas}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Fish className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Aún no tienes capturas registradas
            </h3>
            <p className="text-muted-foreground mb-6">
              Empieza a documentar tus aventuras de pesca
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center space-x-2 bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-lg transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              <span>Agregar Primera Captura</span>
            </button>
          </div>
        )}
        <FormularioCaptura
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={handleSaveCaptura}
        />
      </div>
    </div>
  )
}

export default MisCapturas
