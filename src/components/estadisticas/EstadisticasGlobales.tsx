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
    <div 
      className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900"
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
        <div className={`max-w-7xl mx-auto flex items-center justify-between ${isMobile ? 'px-3 py-4' : 'px-4 py-6'}`}>
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
          <div className={isMobile ? 'flex-1 text-center' : ''}>
            <h1 className={`font-bold italic text-gray-900 dark:text-white ${isMobile ? 'text-xl' : 'text-3xl'}`}>
              Destacados del Mes
            </h1>
            <p className={`text-gray-600 dark:text-gray-400 ${isMobile ? 'text-sm' : 'text-lg'}`}>
              {estadisticas?.mesActual}
            </p>
          </div>
          {isMobile && <div className="w-24"></div>} {/* Spacer para centrar el título */}
        </div>
      </div>
      
      <div className={`flex-1 overflow-y-auto ${isMobile ? 'px-3 py-4' : 'p-4 md:p-8'}`}>
        <div className={`max-w-7xl mx-auto ${isMobile ? 'space-y-4' : 'space-y-6'}`}>

          {isModerator && (
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isMobile ? 'mb-4' : 'mb-8'}`}>
              <div className={`bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white shadow-lg ${isMobile ? 'p-4' : 'p-6'}`}>
                <div className="flex items-center gap-4">
                  <Fish className={isMobile ? 'w-8 h-8 opacity-80' : 'w-12 h-12 opacity-80'} />
                  <div>
                    <p className={`text-blue-100 ${isMobile ? 'text-xs' : 'text-sm'}`}>Total Capturas</p>
                    <p className={`font-bold ${isMobile ? 'text-2xl' : 'text-4xl'}`}>
                      {estadisticas?.totalCapturas || 0}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className={`bg-gradient-to-br from-green-500 to-green-600 rounded-xl text-white shadow-lg ${isMobile ? 'p-4' : 'p-6'}`}>
                <div className="flex items-center gap-4">
                  <Users className={isMobile ? 'w-8 h-8 opacity-80' : 'w-12 h-12 opacity-80'} />
                  <div>
                    <p className={`text-green-100 ${isMobile ? 'text-xs' : 'text-sm'}`}>Pescadores Activos</p>
                    <p className={`font-bold ${isMobile ? 'text-2xl' : 'text-4xl'}`}>
                      {estadisticas?.totalUsuarios || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className={isMobile ? 'mb-4' : 'mb-8'}>
            <div className={`flex items-center gap-2 ${isMobile ? 'mb-3' : 'mb-4'}`}>
              <TrendingUp className={isMobile ? 'w-5 h-5 text-orange-600' : 'w-6 h-6 text-orange-600'} />
              <h2 className={`font-bold text-gray-900 dark:text-white ${isMobile ? 'text-lg' : 'text-2xl'}`}>
                Especies Destacadas
              </h2>
            </div>
            
            <div className={`grid grid-cols-1 lg:grid-cols-3 ${isMobile ? 'gap-4' : 'gap-6'}`}>
              {estadisticas?.especiesDestacadas?.map((especie: any, idx: number) => (
                <div key={especie.especieId} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                  <div className={`h-2 ${idx === 0 ? 'bg-yellow-400' : idx === 1 ? 'bg-gray-400' : 'bg-orange-400'}`}></div>
                  
                  <div className={isMobile ? 'p-4' : 'p-6'}>
                    <div className={`flex items-start justify-between ${isMobile ? 'mb-3' : 'mb-4'}`}>
                      <div className="flex-1 min-w-0 mr-2">
                        <h3 className={`font-bold text-gray-900 dark:text-white ${isMobile ? 'text-base' : 'text-xl'}`}>
                          {especie.nombresComunes?.[0] || especie.nombreCientifico}
                        </h3>
                        <p className={`text-gray-500 dark:text-gray-400 italic ${isMobile ? 'text-xs truncate' : 'text-sm'}`}>
                          {especie.nombreCientifico}
                        </p>
                      </div>
                      <div className={`flex items-center gap-1 bg-blue-100 dark:bg-blue-900 rounded-full flex-shrink-0 ${isMobile ? 'px-2 py-1' : 'px-3 py-1'}`}>
                        <Fish className={`text-blue-600 dark:text-blue-400 ${isMobile ? 'w-3 h-3' : 'w-4 h-4'}`} />
                        <span className={`font-semibold text-blue-600 dark:text-blue-400 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                          {especie.totalCapturasMes}
                        </span>
                      </div>
                    </div>

                    <div className={isMobile ? 'space-y-2' : 'space-y-3'}>
                      {especie.capturasDestacadas?.map((captura: any) => (
                        <div 
                          key={captura.id} 
                          onClick={() => navigate(`/capturas/${captura.id}`)}
                          className={`flex gap-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors ${isMobile ? 'p-2' : 'p-3'}`}
                        >
                          {captura.foto && (
                            <img 
                              src={buildImageUrl(captura.foto)}
                              alt="Captura"
                              className={`object-cover rounded-lg ${isMobile ? 'w-16 h-16' : 'w-20 h-20'}`}
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className={`flex items-center gap-2 ${isMobile ? 'mb-0.5' : 'mb-1'}`}>
                              <span className={`font-bold text-gray-900 dark:text-white ${isMobile ? 'text-sm' : 'text-lg'}`}>
                                {captura.peso ? `${captura.peso} kg` : 'S/P'}
                              </span>
                              {captura.tamanio && (
                                <span className={`text-gray-500 dark:text-gray-400 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                                  • {captura.tamanio} cm
                                </span>
                              )}
                            </div>
                            <p className={`text-gray-600 dark:text-gray-300 truncate ${isMobile ? 'text-xs' : 'text-sm'}`}>
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
            <div className={`flex items-center gap-2 ${isMobile ? 'mb-3' : 'mb-4'}`}>
              <Trophy className={isMobile ? 'w-5 h-5 text-yellow-600' : 'w-6 h-6 text-yellow-600'} />
              <h2 className={`font-bold text-gray-900 dark:text-white ${isMobile ? 'text-lg' : 'text-2xl'}`}>
                Pescadores Destacados
              </h2>
            </div>
            
            <div className={`grid grid-cols-1 md:grid-cols-3 ${isMobile ? 'gap-3' : 'gap-4'}`}>
              {estadisticas?.usuariosDestacados?.map((usuario: any, idx: number) => {
                const fotoUsuario = usuario.foto;
                const foto = fotoUsuario
                  ? fotoUsuario.startsWith("http")
                    ? fotoUsuario
                    : `${import.meta.env.VITE_API_URL}/${fotoUsuario}`
                  : null;
                
                return (
                <div key={usuario.id} className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg ${isMobile ? 'p-4' : 'p-6'}`}>
                  <div className={`flex items-center gap-4 ${isMobile ? 'mb-3' : 'mb-4'}`}>
                    <div className="relative">
                      {foto ? (
                        <img 
                          src={foto}
                          alt={usuario.nombre}
                          className={`rounded-full object-cover ${isMobile ? 'w-12 h-12' : 'w-16 h-16'}`}
                        />
                      ) : (
                        <div className={`rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center ${isMobile ? 'w-12 h-12' : 'w-16 h-16'}`}>
                          <Users className={isMobile ? 'w-6 h-6 text-gray-500' : 'w-8 h-8 text-gray-500'} />
                        </div>
                      )}
                      <div className={`absolute -top-1 -right-1 rounded-full flex items-center justify-center font-bold ${
                        idx === 0 ? 'bg-yellow-400 text-yellow-900' : 
                        idx === 1 ? 'bg-gray-400 text-gray-900' : 
                        'bg-orange-400 text-orange-900'
                      } ${isMobile ? 'w-5 h-5 text-[10px]' : 'w-6 h-6 text-xs'}`}>
                        {idx + 1}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-bold text-gray-900 dark:text-white truncate ${isMobile ? 'text-base' : 'text-lg'}`}>
                        {usuario.nombre}
                      </h3>
                      <p className={`text-gray-600 dark:text-gray-400 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                        {usuario.totalCapturasMes} capturas
                      </p>
                    </div>
                  </div>

                  {usuario.mejorCaptura && (
                    <div className={`border-t border-gray-200 dark:border-gray-700 ${isMobile ? 'pt-3' : 'pt-4'}`}>
                      <p className={`text-gray-500 dark:text-gray-400 ${isMobile ? 'text-[10px] mb-1.5' : 'text-xs mb-2'}`}>
                        Mejor captura:
                      </p>
                      <div 
                        onClick={() => navigate(`/capturas/${usuario.mejorCaptura.id}`)}
                        className="flex gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors"
                      >
                        {usuario.mejorCaptura.foto && (
                          <img 
                            src={buildImageUrl(usuario.mejorCaptura.foto)}
                            alt="Mejor captura"
                            className={`object-cover rounded-lg ${isMobile ? 'w-12 h-12' : 'w-16 h-16'}`}
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className={`font-bold text-gray-900 dark:text-white ${isMobile ? 'text-sm' : ''}`}>
                            {usuario.mejorCaptura.peso ? `${usuario.mejorCaptura.peso} kg` : 'S/P'}
                          </p>
                          <p className={`text-gray-600 dark:text-gray-300 truncate ${isMobile ? 'text-xs' : 'text-sm'}`}>
                            {usuario.mejorCaptura.especie?.nombreCientifico}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
