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
import { useCapturasDestacadas } from "../../hooks/capturas/useCapturasDestacadas"
import { CapturaDestacadaCard } from "../capturas/CapturaDestacadaCard"
import { Trophy, FishIcon, BarChart3, Target } from "lucide-react"
import FormularioCaptura from "../capturas/FormularioCaptura"
import { crearCaptura } from "../../api/capturasApi"
import { EstadisticasSpot } from "../capturas/EstadisticasSpot"
import { useEstadisticasSpot } from "../../hooks/capturas/useEstadisticasSpot"

export default function DetalleSpot() {
  const { id } = useParams<{ id: string }>();
  const { spot, especies, loading, error } = useDetalleSpot(id!);
  const { estadisticas, loading: loadingEstadisticas } = useEstadisticasSpot(id);
  const { capturas: capturasDestacadas, loading: loadingCapturas } = useCapturasDestacadas(id);
  const [esFavorito, setEsFavorito] = useState(false)
  const [formularioAbierto, setFormularioAbierto] = useState(false)

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

  const manejarGuardarCaptura = async (capturaData: any) => {
    try {
      const coordenadas = spot ? obtenerCoordenadas(spot) : undefined;
      
      const datosConSpot = {
        ...capturaData,
        spotId: id,
        latitud: coordenadas?.latitud,
        longitud: coordenadas?.longitud,
      };

      await crearCaptura(datosConSpot);
      alert("✅ Captura registrada con éxito en este spot");
      setFormularioAbierto(false);
      window.location.reload();
    } catch (err: any) {
      alert(`❌ Error al registrar la captura: ${err.message}`);
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
              Descripción
            </h2>
            <p className="text-foreground leading-relaxed text-lg">{spot.descripcion}</p>
          </div>

          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <h2 className="text-2xl font-bold text-card-foreground mb-6 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              Capturas Destacadas
            </h2>
            {loadingCapturas ? (
              <p className="text-muted-foreground">Cargando capturas...</p>
            ) : capturasDestacadas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {capturasDestacadas.map((captura, index) => (
                  <CapturaDestacadaCard key={captura.id} captura={captura} ranking={index + 1} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">Aún no hay capturas registradas en este spot</p>
                <p className="text-sm text-muted-foreground mt-1">¡Sé el primero en registrar una!</p>
              </div>
            )}
          </div>

          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <h2 className="text-2xl font-bold text-card-foreground mb-6 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-primary" />
              Estadísticas del Spot
            </h2>
            <EstadisticasSpot spotId={id!} />
          </div>

          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <h2 className="text-2xl font-bold text-card-foreground mb-6 flex items-center gap-2">
              Especies Registradas
            </h2>
            <ListaEspecies especies={especies} cargando={loading} />
          </div>

          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <h2 className="text-2xl font-bold text-card-foreground mb-6 flex items-center gap-2">
              <Target className="w-6 h-6 text-primary" />
              Tipos de Pesca Más Usados
            </h2>
            {loadingEstadisticas ? (
              <p className="text-muted-foreground">Cargando estadísticas...</p>
            ) : estadisticas?.estadisticas?.tiposPescaMasUsados && estadisticas.estadisticas.tiposPescaMasUsados.length > 0 ? (
              <div className="space-y-3">
                {estadisticas.estadisticas.tiposPescaMasUsados.slice(0, 3).map((tipo, index) => {
                  const total = estadisticas!.estadisticas.totalCapturas
                  const porcentaje = ((tipo.cantidad / total) * 100).toFixed(1)
                  
                  return (
                    <div
                      key={tipo.nombre}
                      className="bg-gradient-to-r from-primary/5 to-transparent border border-border rounded-lg p-4 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-primary">#{index + 1}</span>
                          <h3 className="font-bold text-card-foreground text-lg">{tipo.nombre}</h3>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            {tipo.cantidad} {tipo.cantidad === 1 ? 'captura' : 'capturas'}
                          </p>
                          <p className="text-xs text-primary font-semibold">{porcentaje}%</p>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary rounded-full h-2 transition-all duration-500" 
                          style={{ width: `${porcentaje}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-muted-foreground italic">
                Aún no hay capturas registradas para mostrar estadísticas de tipos de pesca.
              </p>
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

          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl shadow-sm border-2 border-primary/30 p-6 hover:border-primary/50 transition-all duration-300">
            <h3 className="text-xl font-bold text-card-foreground mb-4 flex items-center gap-2">
              <FishIcon className="w-6 h-6 text-primary" />
              Registra tu captura
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              ¿Pescaste en este spot? Registra tu captura y compite por el podio de las mejores capturas.
            </p>
            <button
              onClick={() => setFormularioAbierto(true)}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              <FishIcon className="w-5 h-5" />
              Registrar Captura Aquí
            </button>
          </div>
        </div>
      </div>

      <FormularioCaptura
        isOpen={formularioAbierto}
        onClose={() => setFormularioAbierto(false)}
        onSave={manejarGuardarCaptura}
        coordenadasSpot={coordenadas ?? undefined}
        nombreSpot={spot.nombre}
      />
    </div>
  )
}
