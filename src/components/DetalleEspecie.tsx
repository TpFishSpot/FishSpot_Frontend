import { useState } from "react"
import { useDetalleEspecie } from "../hooks/useDetalleEspecie"
import { baseApi } from "../api/apiFishSpot"

export default function DetalleEspecie() {
  const { especie, carnadas, tiposPesca, cargando, error } = useDetalleEspecie()
  const [esFavorito, setEsFavorito] = useState(false)

  const manejarFavorito = () => setEsFavorito(!esFavorito)
  const manejarVolver = () => window.history.back()

  if (cargando) return <p>Cargando...</p>
  if (error || !especie) return <p>{error || "Especie no encontrada"}</p>

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold italic text-gray-900">
            {especie.nombre_cientifico}
          </h1>
          <div className="flex gap-3">
            <button
              onClick={manejarFavorito}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                esFavorito
                  ? "bg-yellow-400 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {esFavorito ? "★ Favorito" : "☆ Favorito"}
            </button>
            <button
              onClick={manejarVolver}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 font-semibold text-gray-700"
            >
              ← Volver
            </button>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna principal */}
        <div className="lg:col-span-2 space-y-8">
          {/* Imagen */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex justify-center">
            <img
              src={especie.imagen ? `${baseApi}/${especie.imagen}` : "/colorful-fish-shoal.png"}
              alt={especie.nombre_cientifico}
              className="w-64 h-64 object-contain rounded-lg"
            />
          </div>

          {/* Descripción */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-green-600">📖</span>
              Descripción
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">{especie.descripcion}</p>
          </div>

          {/* Nombres comunes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-blue-600">📝</span>
              Nombres comunes
            </h2>
            {especie.nombre_comun?.length ? (
              <div className="flex flex-wrap gap-2">
                {especie.nombre_comun.map((nombre, i) => (
                  <span
                    key={i}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {nombre}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No especificados</p>
            )}
          </div>

          {/* Carnadas */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-red-600">🪱</span>
              Carnadas recomendadas
            </h2>
            {carnadas?.length ? (
              <ul className="list-disc pl-5 text-gray-700">
                {carnadas.map((c) => (
                  <li key={c.idCarnada}>{c.nombre}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No especificadas</p>
            )}
          </div>

          {/* Tipos de pesca */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-yellow-600">🎣</span>
              Tipos de pesca recomendados
            </h2>
            {tiposPesca?.length ? (
  <ul className="list-disc pl-5 text-gray-700">
    {tiposPesca.map(({ id, nombre, descripcion }) => (
      <li key={id}>
        <span className="font-semibold">{nombre}</span>
        {descripcion && (
          <p className="text-gray-600 text-sm ml-4">{descripcion}</p>
        )}
      </li>
    ))}
  </ul>
) : (
  <p className="text-gray-500 italic">No especificados</p>
)}
          </div>
        </div>

        {/* Columna lateral */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-purple-600">ℹ️</span>
              Información adicional
            </h3>
            <p className="text-gray-600 text-sm">
              Próximamente: estado de conservación, hábitat, reseñas, etc.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
