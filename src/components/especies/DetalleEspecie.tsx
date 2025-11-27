import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDetalleEspecie } from "../../hooks/especies/useDetalleEspecie"
import { obtenerNombreMostrar } from "../../utils/especiesUtils"
import { useIsMobile } from "../../hooks/useIsMobile"
import NavigationBar from "../common/NavigationBar"
import MobileNavigationBar from "../common/MobileNavigationBar"
import { ImagenResponsive } from "../common/imgenResponsive"

export default function DetalleEspecie() {
  const { especie, carnadas, tiposPesca, cargando, error } = useDetalleEspecie()
  const [esFavorito, setEsFavorito] = useState(false)
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  const manejarFavorito = () => setEsFavorito(!esFavorito)
  const manejarVolver = () => window.history.back()
  
  const irAlMapaConFiltro = () => {
    if (!especie) return
    const nombreFiltro = obtenerNombreMostrar(especie as any)
    navigate(`/mapa?especie=${encodeURIComponent(nombreFiltro)}`)
  }

  if (cargando) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Cargando...</p>
      </div>
    </div>
  )
  
  if (error || !especie) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="text-center">
        <p className="text-red-600 dark:text-red-400">{error || "Especie no encontrada"}</p>
        <button onClick={manejarVolver} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">
          Volver
        </button>
      </div>
    </div>
  )

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 transition-colors"
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
        className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors"
        style={
          isMobile
            ? {
                marginTop: "max(56px, calc(56px + env(safe-area-inset-top)))",
              }
            : {}
        }
      >
        <div className={`max-w-6xl mx-auto flex items-center justify-between ${isMobile ? 'px-3 py-4' : 'px-4 py-6'}`}>
          {isMobile && (
            <button
              onClick={manejarVolver}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Volver</span>
            </button>
          )}
          <h1 className={`font-bold italic text-gray-900 dark:text-gray-100 ${isMobile ? 'text-lg' : 'text-3xl'}`}>
            {isMobile && especie.nombresComunes?.length 
              ? especie.nombresComunes[0].nombre 
              : especie.nombre_cientifico}
          </h1>
          <div className={`flex gap-2 ${isMobile ? '' : 'gap-3'}`}>
            <button
              onClick={irAlMapaConFiltro}
              className={`rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors flex items-center justify-center gap-2 ${isMobile ? 'px-3 py-2 text-xs' : 'px-4 py-2'}`}
            >
              {isMobile ? '🗺️' : 'Dónde pescar'}
            </button>
            <button
              onClick={manejarFavorito}
              className={`rounded-lg font-semibold transition-colors ${
                esFavorito
                  ? "bg-yellow-400 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
              } ${isMobile ? 'px-3 py-2 text-xs' : 'px-4 py-2'}`}
            >
              {esFavorito ? "★" : "☆"} {!isMobile && "Favorito"}
            </button>
            {!isMobile && (
              <button
                onClick={manejarVolver}
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 font-semibold text-gray-700 dark:text-gray-200 transition-colors"
              >
                ← Volver
              </button>
            )}
          </div>
        </div>
      </div>

      <div className={`max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 ${isMobile ? 'px-3 py-4 gap-4' : 'px-4 py-8 gap-8'}`}>

        <div className={`lg:col-span-2 ${isMobile ? 'space-y-4' : 'space-y-8'}`}>

          <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex justify-center transition-colors ${isMobile ? 'p-4' : 'p-6'}`}>
            <ImagenResponsive
              src={especie.imagen || "/colorful-fish-shoal.png"}
              alt={especie.nombre_cientifico}
              aspectRatio="square"
              objectFit="contain"
              className={`rounded-lg ${isMobile ? 'w-48 h-48' : 'w-64 h-64'}`}
            />
          </div>

          
          <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors ${isMobile ? 'p-4' : 'p-6'}`}>
            <h2 className={`font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2 ${isMobile ? 'text-lg' : 'text-2xl mb-4'}`}>
              <span className="text-green-600">📖</span> Descripción
            </h2>
            <p className={`text-gray-700 dark:text-gray-300 leading-relaxed ${isMobile ? 'text-sm' : 'text-lg'}`}>
              {especie.descripcion}
            </p>
          </div>

          <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors ${isMobile ? 'p-4' : 'p-6'}`}>
            <h2 className={`font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2 ${isMobile ? 'text-lg' : 'text-2xl mb-4'}`}>
              <span className="text-blue-600">📝</span> Nombres comunes
            </h2>
            {especie.nombresComunes?.length ? (
              <div className="flex flex-wrap gap-2">
                {especie.nombresComunes.map((nombreObj, i) => (
                  <span
                    key={i}
                    className={`bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-blue-200 rounded-full font-medium ${isMobile ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-sm'}`}
                  >
                    {nombreObj.nombre}
                  </span>
                ))}
              </div>
            ) : (
              <p className={`text-gray-500 dark:text-gray-400 italic ${isMobile ? 'text-xs' : 'text-sm'}`}>
                No especificados
              </p>
            )}
          </div>

          <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors ${isMobile ? 'p-4' : 'p-6'}`}>
            <h2 className={`font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2 ${isMobile ? 'text-lg' : 'text-2xl mb-4'}`}>
              <span className="text-red-600">🪱</span> Carnadas recomendadas
            </h2>
            {carnadas?.length ? (
              <ul className={`list-disc pl-5 text-gray-700 dark:text-gray-300 ${isMobile ? 'text-sm' : ''}`}>
                {carnadas.map((c) => (
                  <li key={c.idCarnada}>{c.nombre}</li>
                ))}
              </ul>
            ) : (
              <p className={`text-gray-500 dark:text-gray-400 italic ${isMobile ? 'text-xs' : 'text-sm'}`}>
                No especificadas
              </p>
            )}
          </div>

          <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors ${isMobile ? 'p-4' : 'p-6'}`}>
            <h2 className={`font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2 ${isMobile ? 'text-lg' : 'text-2xl mb-4'}`}>
              Tipos de pesca recomendados
            </h2>
            {tiposPesca?.length ? (
              <ul className={`list-disc pl-5 text-gray-700 dark:text-gray-300 ${isMobile ? 'text-sm' : ''}`}>
                {tiposPesca.map(({ id, nombre, descripcion }) => (
                  <li key={id}>
                    <span className="font-semibold">{nombre}</span>
                    {descripcion && (
                      <p className={`text-gray-600 dark:text-gray-400 ml-4 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                        {descripcion}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className={`text-gray-500 dark:text-gray-400 italic ${isMobile ? 'text-xs' : 'text-sm'}`}>
                No especificados
              </p>
            )}
          </div>
        </div>

        <div className={isMobile ? 'space-y-4' : 'space-y-6'}>
          <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors ${isMobile ? 'p-4' : 'p-6'}`}>
            <h3 className={`font-bold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2 ${isMobile ? 'text-base' : 'text-xl mb-4'}`}>
              <span className="text-purple-600">ℹ️</span> Información adicional
            </h3>
            <p className={`text-gray-600 dark:text-gray-300 ${isMobile ? 'text-xs' : 'text-sm'}`}>
              Próximamente: estado de conservación, hábitat, reseñas, etc.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
