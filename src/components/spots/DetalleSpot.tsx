import type React from "react"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import ListaEspecies from "../especies/ListaEspecies"
import SpotHeader from "./SpotHeader"
import { useDetalleSpot } from "../../hooks/spots/useDetalleSpot"
import { obtenerCoordenadas } from "../../utils/spotUtils"
import apiFishSpot from "../../api/apiFishSpot"
import type { Comentario } from "../../modelo/Comentario"
import ComentariosList from "../comentario/ComentariosList"

const formatNumber = (num: number | undefined | null, decimals = 1): string => {
  return (num || 0).toFixed(decimals);
}

export default function DetalleSpot() {
  const { id } = useParams<{ id: string }>();
  const { spot, especies, tiposPesca, loading, error } = useDetalleSpot(id!);
  const [esFavorito, setEsFavorito] = useState(false)

  const [comentarios, setComentarios] = useState<Comentario[]>([])
  const [nuevoComentario, setNuevoComentario] = useState("")
  const [loadingComentarios, setLoadingComentarios] = useState(false)
  const [errorComentarios, setErrorComentarios] = useState("")

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

  const cargarComentarios = async () => {
    if (!id) return;
    try {
      setLoadingComentarios(true);

      const token = localStorage.getItem("token");
      const { data } = await apiFishSpot.get(`/comentario/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setComentarios(data);
    } catch (err: any) {
      setErrorComentarios(err.message);
    } finally {
      setLoadingComentarios(false);
    }
  };

  const enviarComentario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoComentario.trim()) return;

    try {
      const token = localStorage.getItem("token");
      await apiFishSpot.post(
        "/comentario",
        { idSpot: id, contenido: nuevoComentario },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("✅ Comentario publicado con éxito");
      setNuevoComentario("");
      cargarComentarios();
    } catch (err: any) {
      alert(`❌ Error: ${err.message}`);
    }
  };

  useEffect(() => {
    cargarComentarios()
  }, [id])

  if (loading) return <p>Cargando...</p>
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
            <ListaEspecies especies={especies} cargando={loading} />
          </div>

          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <h2 className="text-2xl font-bold text-card-foreground mb-6 flex items-center gap-2">
              <span className="text-secondary">🎣</span>
              Tipos de Pesca
            </h2>
            {loading ? (
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
          
          <ComentariosList
            comentarios={comentarios}
            loading={loadingComentarios}
            error={errorComentarios}
            nuevoComentario={nuevoComentario}
            setNuevoComentario={setNuevoComentario}
            enviarComentario={enviarComentario}
          />
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
                  <span className="font-mono">{formatNumber(coordenadas.latitud, 6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Longitud:</span>
                  <span className="font-mono">{formatNumber(coordenadas.longitud, 6)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
