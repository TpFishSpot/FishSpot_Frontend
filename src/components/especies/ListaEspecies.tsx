import { Link } from "react-router-dom"
import type { EspecieConNombreComun } from "../../modelo/EspecieConNombreComun"
import { Fish } from "lucide-react"
import { baseApi } from "../../api/apiFishSpot"

interface Props {
  especies: EspecieConNombreComun[]
  cargando: boolean
}

export default function ListaEspecies({ especies, cargando }: Props) {
  if (cargando) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3 text-blue-600">
          <Fish className="w-6 h-6 animate-pulse" />
          <p className="text-lg font-medium">Cargando especies...</p>
        </div>
      </div>
    )
  }

  if (especies.length === 0) {
    return (
      <div className="text-center py-12">
        <Fish className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600 text-lg">No se registraron especies en este spot.</p>
        <p className="text-gray-500 text-sm mt-2">¡Sé el primero en reportar una especie aquí!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {especies.map((especie) => (
        <Link key={especie.id} to={`/especie/${especie.id}`}>
          <div className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-4 hover:bg-white/30 transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <img
                  src={especie.imagen ? `${baseApi}/${especie.imagen}` : "/colorful-fish-shoal.png"}
                  alt={especie.nombre_cientifico}
                  className="w-16 h-16 rounded-lg object-cover border-2 border-white/50 shadow-md"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/colorful-fish-shoal.png"
                  }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-800 text-lg italic mb-1">{especie.nombre_cientifico}</h4>

                {especie.descripcion && <p className="text-gray-600 text-sm mb-3 line-clamp-2">{especie.descripcion}</p>}

                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-700 uppercase tracking-wide">Nombres comunes:</p>
                  <div className="flex flex-wrap gap-1">
                    {Array.isArray(especie.nombre_comun) && especie.nombre_comun.length > 0 ? (
                      especie.nombre_comun.map((nombre, index) => (
                        <span
                          key={index}
                          className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium"
                        >
                          {nombre}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-xs italic">No especificados</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
