import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Circle } from 'react-leaflet'
import { ArrowLeft, Fish, Calendar, Clock, Cloud, Weight, Ruler, MapPin, Edit, Trash2, User, Worm } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { buildImageUrl } from '../../utils/imageUtils'
import { obtenerNombreMostrar } from '../../utils/especiesUtils'
import { ComentariosList } from '../comentario/ComentariosList'
import NavigationBar from '../common/NavigationBar'
import MobileNavigationBar from '../common/MobileNavigationBar'
import { useIsMobile } from '../../hooks/useIsMobile'
import apiFishSpot from '../../api/apiFishSpot'
import L from 'leaflet'
import type { Usuario } from '../../modelo/Usuario'
import type { TipoPesca } from '../../modelo/TipoPesca'
import { ImagenResponsive } from '../common/imgenResponsive'

const DetalleCaptura = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const isMobile = useIsMobile()
  const [captura, setCaptura] = useState<any>(null)
  const [cargando, setCargando] = useState(true)
  const [usuarioCaptura, setUsuarioCaptura] = useState<Usuario | null>(null);
  const fotoUsuario = usuarioCaptura?.foto;
  const foto = fotoUsuario 
    ? fotoUsuario?.startsWith('http') 
        ? fotoUsuario
        :`${import.meta.env.VITE_API_URL}${fotoUsuario}`
    : null;
  const [tipoPesca, setTipoPesca] = useState<TipoPesca | null>(null); 

  useEffect(() => {
    const cargarCaptura = async () => {
      try {
        const response = await apiFishSpot.get(`/capturas/${id}`)
        setCaptura(response.data)
        if (response.data?.idUsuario) {
          const usuario = await apiFishSpot.get(`/usuario/${response.data.idUsuario}`);
          setUsuarioCaptura(usuario.data);
        }
        if (response.data?.tipoPesca) {
          const tipoPescaRes = await apiFishSpot.get(`/tipopesca/${response.data.tipoPesca}`);
          setTipoPesca(tipoPescaRes.data);
        }
      } catch (error) {
        console.error('Error cargando captura:', error)
      } finally {
        setCargando(false)
      }
    }
    if (id) cargarCaptura()
  }, [id])

  const handleEliminar = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta captura?')) return
    
    try {
      await apiFishSpot.delete(`/capturas/${id}`)
      navigate('/mis-capturas')
    } catch (error) {
      console.error('Error eliminando captura:', error)
      alert('Error al eliminar la captura')
    }
  }

  const handleVerUbicacion = () => {
    if (captura.spotId) {
      navigate(`/spots/${captura.spotId}`)
    } else if (captura.latitud && captura.longitud) {
      navigate('/mapa', { state: { lat: captura.latitud, lng: captura.longitud } })
    }
  }

  if (cargando) {
    return (
      <div className="h-screen flex flex-col">
        {isMobile ? <MobileNavigationBar /> : <NavigationBar />}
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  if (!captura) {
    return (
      <div className="h-screen flex flex-col">
        {isMobile ? <MobileNavigationBar /> : <NavigationBar />}
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-600 dark:text-gray-400">Captura no encontrada</p>
        </div>
      </div>
    )
  }

  const esPropia = user?.uid === captura.idUsuario
  const nombreEspecie = obtenerNombreMostrar(captura.especie)
  const position: [number, number] = captura.latitud && captura.longitud 
    ? [captura.latitud, captura.longitud]
    : captura.spot?.ubicacion?.coordinates 
    ? [captura.spot.ubicacion.coordinates[1], captura.spot.ubicacion.coordinates[0]]
    : [-34.9011, -56.1645]

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {isMobile ? <MobileNavigationBar /> : <NavigationBar />}

      <div className="flex-1 overflow-y-auto" style={isMobile ? { paddingBottom: '120px' } : {}}>
        <div className={`max-w-4xl mx-auto p-4 md:p-8 ${isMobile ? 'mt-16' : ''}`}>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden relative">
            <div className="relative w-full" style={{ height: '400px' }}>
              <ImagenResponsive 
                src={captura.foto}
                alt="Captura"
                aspectRatio="auto"
                objectFit="contain"
                className="w-full h-full"
              />
            </div>
            <button
              onClick={() => navigate(-1)}
              className="absolute top-4 left-4 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 bg-white dark:bg-gray-800 rounded-lg px-2 py-1 shadow z-50"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Volver</span>
            </button>

            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <button
                    onClick={() => navigate(`/especie/${captura.especieId}`)}
                    className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left"
                  >
                    {nombreEspecie}
                  </button>
                  {captura.especie?.nombreCientifico && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic mt-1">
                      {captura.especie.nombreCientifico}
                    </p>
                  )}
                </div>
                {esPropia && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/editar-captura/${id}`)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleEliminar}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                {foto ? (
                  <img 
                    src={foto} 
                    alt={captura.usuario?.nombre} 
                    className="w-12 h-12 rounded-full object-cover" 
                  />
                ) : (
                  <User className="w-12 h-12 text-primary" />
                )}
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Capturado por
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {captura.usuario?.nombre || 'Usuario'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {captura.peso && (
                  <div className="flex items-center gap-2">
                    <Weight className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Peso</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{captura.peso} kg</p>
                    </div>
                  </div>
                )}
                {captura.tamanio && (
                  <div className="flex items-center gap-2">
                    <Ruler className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Tamaño</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{captura.tamanio} cm</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Fecha</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {new Date(captura.fecha).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {captura.horaCaptura && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Hora</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{captura.horaCaptura}</p>
                    </div>
                  </div>
                )}
                {captura.clima && (
                  <div className="flex items-center gap-2">
                    <Cloud className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Clima</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{captura.clima}</p>
                    </div>
                  </div>
                )}
                {captura.carnada && (
                  <div className="flex items-center gap-2">
                    <Worm className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Carnada</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{captura.carnada}</p>
                    </div>
                  </div>
                )}
                {tipoPesca && (
                  <div className="flex items-center gap-2">
                    <Fish className="w-5 h-5 text-teal-600" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Tipo</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{tipoPesca.nombre}</p>
                    </div>
                  </div>
                )}
              </div>

              {captura.notas && (
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Notas</p>
                  <p className="text-gray-600 dark:text-gray-400">{captura.notas}</p>
                </div>
              )}

              {(captura.latitud && captura.longitud || captura.spot) && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ubicación</h3>
                    <button
                      onClick={handleVerUbicacion}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>{captura.spotId ? 'Ver Spot' : 'Ver en Mapa'}</span>
                    </button>
                  </div>
                  {captura.spot && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      📍 {captura.spot.nombre}
                    </p>
                  )}
                  <div className="h-64 md:h-96 rounded-lg overflow-hidden relative z-0">
                    <MapContainer
                      center={position}
                      zoom={13}
                      className="h-full w-full"
                      zoomControl={false}
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Marker
                        position={position}
                        icon={L.divIcon({
                          className: 'custom-marker',
                          html: `<div style="background: #3b82f6; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
                          iconSize: [32, 32],
                          iconAnchor: [16, 16],
                        })}
                      />
                      <Circle
                        center={position}
                        radius={100}
                        pathOptions={{
                          color: '#3b82f6',
                          fillColor: '#3b82f6',
                          fillOpacity: 0.1,
                        }}
                      />
                    </MapContainer>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Comentarios</h3>
            <ComentariosList idCaptura={id!} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetalleCaptura
