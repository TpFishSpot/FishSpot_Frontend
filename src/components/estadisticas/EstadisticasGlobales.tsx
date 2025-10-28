import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { obtenerEstadisticasGlobales } from '../../api/capturasApi'
import { buildImageUrl } from '../../utils/imageUtils'
import { useUserRoles } from '../../hooks/auth/useUserRoles'
import NavigationBar from '../common/NavigationBar'
import MobileNavigationBar from '../common/MobileNavigationBar'
import { useIsMobile } from '../../hooks/useIsMobile'
import { Trophy, Users, Fish, TrendingUp } from 'lucide-react'

export const EstadisticasGlobales = () => {
  const [estadisticas, setEstadisticas] = useState<any>(null)
  const [cargando, setCargando] = useState(true)
  const { isModerator } = useUserRoles()
  const isMobile = useIsMobile()
  const navigate = useNavigate()

  useEffect(() => {
    const cargarEstadisticas = async () => {
      try {
        const data = await obtenerEstadisticasGlobales()
        setEstadisticas(data)
      } catch (error) {
        console.error('Error cargando estadísticas:', error)
      } finally {
        setCargando(false)
      }
    }
    cargarEstadisticas()
  }, [])

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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {isMobile ? <MobileNavigationBar /> : <NavigationBar />}
      
      <div className="flex-1 p-4 md:p-8 overflow-y-auto" style={isMobile ? { paddingBottom: '120px' } : {}}>
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Destacados del Mes
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">{estadisticas?.mesActual}</p>
          </div>

          {isModerator && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center gap-4">
                  <Fish className="w-12 h-12 opacity-80" />
                  <div>
                    <p className="text-blue-100 text-sm">Total Capturas</p>
                    <p className="text-4xl font-bold">{estadisticas?.totalCapturas || 0}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center gap-4">
                  <Users className="w-12 h-12 opacity-80" />
                  <div>
                    <p className="text-green-100 text-sm">Pescadores Activos</p>
                    <p className="text-4xl font-bold">{estadisticas?.totalUsuarios || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-6 h-6 text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Especies Destacadas</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {estadisticas?.especiesDestacadas?.map((especie: any, idx: number) => (
                <div key={especie.especieId} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                  <div className={`h-2 ${idx === 0 ? 'bg-yellow-400' : idx === 1 ? 'bg-gray-400' : 'bg-orange-400'}`}></div>
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {especie.nombresComunes?.[0] || especie.nombreCientifico}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                          {especie.nombreCientifico}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-full">
                        <Fish className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                          {especie.totalCapturasMes}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {especie.capturasDestacadas?.map((captura: any) => (
                        <div 
                          key={captura.id} 
                          onClick={() => navigate(`/capturas/${captura.id}`)}
                          className="flex gap-3 bg-gray-50 dark:bg-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                        >
                          {captura.foto && (
                            <img 
                              src={buildImageUrl(captura.foto)}
                              alt="Captura"
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-lg text-gray-900 dark:text-white">
                                {captura.peso ? `${captura.peso} kg` : 'S/P'}
                              </span>
                              {captura.tamanio && (
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  • {captura.tamanio} cm
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                              {captura.usuario?.nombre || 'Anónimo'}
                            </p>
                            {captura.spot && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                📍 {captura.spot.nombre}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-6 h-6 text-yellow-600" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Pescadores Destacados</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {estadisticas?.usuariosDestacados?.map((usuario: any, idx: number) => (
                <div key={usuario.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                      {usuario.foto ? (
                        <img 
                          src={usuario.foto}
                          alt={usuario.nombre}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                          <Users className="w-8 h-8 text-gray-500" />
                        </div>
                      )}
                      <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        idx === 0 ? 'bg-yellow-400 text-yellow-900' : 
                        idx === 1 ? 'bg-gray-400 text-gray-900' : 
                        'bg-orange-400 text-orange-900'
                      }`}>
                        {idx + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">
                        {usuario.nombre}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {usuario.totalCapturasMes} capturas
                      </p>
                    </div>
                  </div>

                  {usuario.mejorCaptura && (
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Mejor captura:</p>
                      <div 
                        onClick={() => navigate(`/capturas/${usuario.mejorCaptura.id}`)}
                        className="flex gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors"
                      >
                        {usuario.mejorCaptura.foto && (
                          <img 
                            src={buildImageUrl(usuario.mejorCaptura.foto)}
                            alt="Mejor captura"
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 dark:text-white">
                            {usuario.mejorCaptura.peso ? `${usuario.mejorCaptura.peso} kg` : 'S/P'}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                            {usuario.mejorCaptura.especie?.nombreCientifico}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
