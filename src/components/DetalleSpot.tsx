import type React from "react"
import { useState } from "react"
import ListaEspecies from "../components/ListaEspecies"
import SpotHeader from "../components/SpotHeader"
import { useDetalleSpot } from "../hooks/useDetalleSpot"
import { obtenerCoordenadas } from "../utils/spotUtils"

export default function DetalleSpot() {
  const { spot, especies, tiposPesca, cargando, cargandoEspecies, cargandoTiposPesca, error } = useDetalleSpot()
  const [esFavorito, setEsFavorito] = useState(false)
  const [reseña, setReseña] = useState("")
  const [calificacion, setCalificacion] = useState(0)

  const manejarFavorito = () => setEsFavorito(!esFavorito)

  const manejarCompartir = () => {
    if (!spot) return
    if (navigator.share) {
      navigator.share({ title: `Spot de pesca: ${spot.nombre}`, text: spot.descripcion, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Enlace copiado al portapapeles!")
    }
  }

  const manejarVolver = () => window.history.back()
  const manejarEnviarReseña = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Funcionalidad de reseñas próximamente disponible")
  }

  if (cargando) return <p>Cargando...</p>
  if (error || !spot) return <p>{error || "Spot no encontrado"}</p>

  const coordenadas = obtenerCoordenadas(spot)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SpotHeader
        spot={spot}
        esFavorito={esFavorito}
        manejarFavorito={manejarFavorito}
        manejarCompartir={manejarCompartir}
        manejarVolver={manejarVolver}
      />

      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <h2 className="text-2xl font-bold text-card-foreground mb-4 flex items-center gap-2">
              <span className="text-primary">📍</span>
              Descripción
            </h2>
            <p className="text-foreground leading-relaxed text-lg">{spot.descripcion}</p>
          </div>

       
          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <h2 className="text-2xl font-bold text-card-foreground mb-6 flex items-center gap-2">
              <span className="text-accent">🐟</span>
              Especies Registradas
            </h2>
            <ListaEspecies especies={especies} cargando={cargandoEspecies} />
          </div>

      
          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <h2 className="text-2xl font-bold text-card-foreground mb-6 flex items-center gap-2">
              <span className="text-secondary">🎣</span>
              Tipos de Pesca
            </h2>
            {cargandoTiposPesca ? (
              <p className="text-muted-foreground">Cargando tipos de pesca...</p>
            ) : tiposPesca.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tiposPesca.map((tipoPesca) => (
                  <div
                    key={tipoPesca.id}
                    className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-all duration-200"
                  >
                    <h3 className="font-bold text-card-foreground text-lg mb-2">{tipoPesca.nombre}</h3>
                    <p className="text-foreground text-sm leading-relaxed">{tipoPesca.descripcion}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground italic">No hay tipos de pesca registrados para este spot.</p>
            )}
          </div>

          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <h2 className="text-2xl font-bold text-card-foreground mb-6 flex items-center gap-2">
              <span className="text-yellow-500">⭐</span>
              Escribir Reseña
            </h2>
            <form onSubmit={manejarEnviarReseña} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">Calificación</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((estrella) => (
                    <button
                      key={estrella}
                      type="button"
                      onClick={() => setCalificacion(estrella)}
                      className={`text-3xl transition-all duration-200 hover:scale-110 ${
                        estrella <= calificacion
                          ? "text-yellow-400 drop-shadow-sm"
                          : "text-muted-foreground hover:text-yellow-200"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                {calificacion > 0 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {calificacion === 1 && "Muy malo"}
                    {calificacion === 2 && "Malo"}
                    {calificacion === 3 && "Regular"}
                    {calificacion === 4 && "Bueno"}
                    {calificacion === 5 && "Excelente"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">Tu experiencia</label>
                <textarea
                  value={reseña}
                  onChange={(e) => setReseña(e.target.value)}
                  placeholder="Comparte tu experiencia en este spot de pesca..."
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition-all duration-200 bg-card text-card-foreground"
                  rows={4}
                />
              </div>

              <button
                type="submit"
                disabled={!calificacion || !reseña.trim()}
                className="w-full bg-primary text-primary-foreground font-semibold py-3 px-6 rounded-lg hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100"
              >
                Enviar Reseña
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <h3 className="text-xl font-bold text-card-foreground mb-4 flex items-center gap-2">
              <span className="text-emerald-500">🎯</span>
              Estado del Spot
            </h3>
            <div
              className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-semibold ${
                spot.estado === "Aceptado"
                  ? "bg-green-100 text-green-800"
                  : spot.estado === "Inactivo"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full mr-2 ${
                  spot.estado === "Aceptado"
                    ? "bg-green-500"
                    : spot.estado === "Inactivo"
                      ? "bg-red-500"
                      : "bg-yellow-500"
                }`}
              ></span>
              {spot.estado}
            </div>
          </div>

          {coordenadas && (
            <div className="bg-card rounded-xl shadow-sm border border-border p-6">
              <h3 className="text-xl font-bold text-card-foreground mb-4 flex items-center gap-2">
                <span className="text-primary">🗺️</span>
                Coordenadas
              </h3>
              <div className="space-y-2 text-sm text-foreground">
                <div className="flex justify-between">
                  <span className="font-medium">Latitud:</span>
                  <span className="font-mono">{coordenadas.latitud.toFixed(6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Longitud:</span>
                  <span className="font-mono">{coordenadas.longitud.toFixed(6)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
