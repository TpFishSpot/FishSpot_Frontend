import React, { useState } from "react"
import ListaEspecies from "../components/ListaEspecies"
import SpotHeader from "../components/SpotHeader"
import { useDetalleSpot } from "../hooks/useDetalleSpot"
import { obtenerCoordenadas } from "../utils/spotUtils"

export default function DetalleSpot() {
  const { spot, especies, cargando, cargandoEspecies, error } = useDetalleSpot()
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
    console.log({ calificacion, reseña })
    alert("Funcionalidad de reseñas próximamente disponible")
  }

  if (cargando) return <p>Cargando...</p>
  if (error || !spot) return <p>{error || "Spot no encontrado"}</p>

  const coordenadas = obtenerCoordenadas(spot)

  return (
    <div>
      <SpotHeader
        spot={spot}
        esFavorito={esFavorito}
        manejarFavorito={manejarFavorito}
        manejarCompartir={manejarCompartir}
        manejarVolver={manejarVolver}
      />

      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2>Descripción</h2>
            <p>{spot.descripcion}</p>
          </div>

          <div>
            <h2>Especies Registradas</h2>
            <ListaEspecies especies={especies} cargando={cargandoEspecies} />
          </div>

          <div>
            <h2>Escribir Reseña</h2>
            <form onSubmit={manejarEnviarReseña} className="space-y-4">
              <div>
                {[1, 2, 3, 4, 5].map((estrella) => (
                  <button key={estrella} type="button" onClick={() => setCalificacion(estrella)}>
                    {estrella <= calificacion ? "★" : "☆"}
                  </button>
                ))}
              </div>
              <textarea value={reseña} onChange={(e) => setReseña(e.target.value)} />
              <button type="submit" disabled={!calificacion || !reseña.trim()}>
                Enviar Reseña
              </button>
            </form>
          </div>
        </div>

        <div>
          <h3>Estado del Spot</h3>
          <div>{spot.estado}</div>
        </div>
      </div>
    </div>
  )
}
