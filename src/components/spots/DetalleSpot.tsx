import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import ListaEspecies from "../especies/ListaEspecies"
import SpotHeader from "./SpotHeader"
import { useDetalleSpot } from "../../hooks/spots/useDetalleSpot"
import { obtenerCoordenadas } from "../../utils/spotUtils"
import { ComentariosList } from "../comentario/ComentariosList"
import { useCapturasDestacadas } from "../../hooks/capturas/useCapturasDestacadas"
import { BarChart3, Sparkles } from "lucide-react"
import FormularioCaptura from "../capturas/FormularioCaptura"
import { crearCaptura } from "../../api/capturasApi"
import { EstadisticasSpot } from "../capturas/EstadisticasSpot"
import { useEstadisticasSpot } from "../../hooks/capturas/useEstadisticasSpot"
import { SpotDescripcion } from "./SpotDescripcion"
import { SpotCapturasDestacadas } from "./SpotCapturasDestacadas"
import { SpotTiposPesca } from "./SpotTiposPesca"
import { SpotSidebar } from "./SpotSidebar"
import { useIsMobile } from "../../hooks/useIsMobile"

export default function DetalleSpot() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { spot, especies, loading, error } = useDetalleSpot(id!);
  const { estadisticas, loading: loadingEstadisticas } = useEstadisticasSpot(id);
  const { capturas: capturasDestacadas, loading: loadingCapturas } = useCapturasDestacadas(id);
  const [esFavorito, setEsFavorito] = useState(false)
  const [formularioAbierto, setFormularioAbierto] = useState(false)
  const isMobile = useIsMobile()

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

  if (loading) return <p>Cargando...</p>
  if (error || !spot) return <p>{error || "Spot no encontrado"}</p>

  const coordenadas = obtenerCoordenadas(spot)

  return (
    <div 
      className="min-h-screen bg-background text-foreground"
      style={
        isMobile
          ? { paddingBottom: "max(96px, calc(96px + env(safe-area-inset-bottom)))", }
          : {}
      }
    >
      <SpotHeader
        spot={spot}
        esFavorito={esFavorito}
        manejarFavorito={manejarFavorito}
        manejarCompartir={manejarCompartir}
        manejarVolver={manejarVolver}
      />

      <div 
        className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8"
        style={isMobile ? { paddingTop: "max(76px, calc(76px + env(safe-area-inset-top)))" } : {}}
      >
        <div className="lg:col-span-2 space-y-8">
          <SpotDescripcion descripcion={spot.descripcion} />

          {/* Tarjeta interactiva del Baqueano IA */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950/40 via-card to-teal-950/30 border border-emerald-500/30 p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-2xl shadow-inner border border-emerald-500/30">
                  🤠
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-foreground flex items-center gap-2">
                    <span>Baqueano IA de este Spot</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Guía en Vivo
                    </span>
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Preguntale sobre distancias de tiro, colores de señuelos, mareas, aparejos y secretos para pescar hoy acá.
                  </p>
                </div>
              </div>
            </div>

            {/* Preguntas rápidas contextualizadas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {[
                "🎯 ¿A qué distancia y profundidad conviene pescar acá?",
                "🎨 ¿Qué tipo y color de señuelo rinde según el agua y la luz?",
                "🌊 ¿Qué marea, viento y horario favorecen a este lugar?",
                "🪱 ¿Qué carnadas y aparejos armar para las especies activas?",
              ].map((pregunta, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    const params = new URLSearchParams();
                    params.set("lugar", spot.nombre);
                    if (coordenadas) {
                      params.set("lat", String(coordenadas.latitud));
                      params.set("lng", String(coordenadas.longitud));
                    }
                    params.set("pregunta", pregunta.replace(/^[^\s]+\s/, ""));
                    navigate(`/chatbot?${params.toString()}`);
                  }}
                  className="text-left p-3 rounded-2xl bg-card/60 hover:bg-emerald-500/10 border border-border/80 hover:border-emerald-500/40 text-xs text-foreground font-medium transition-all active:scale-98 flex items-center justify-between gap-2 group cursor-pointer"
                >
                  <span className="truncate">{pregunta}</span>
                  <span className="text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity font-bold">→</span>
                </button>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  const params = new URLSearchParams();
                  params.set("lugar", spot.nombre);
                  if (coordenadas) {
                    params.set("lat", String(coordenadas.latitud));
                    params.set("lng", String(coordenadas.longitud));
                  }
                  navigate(`/chatbot?${params.toString()}`);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-emerald-600/25 active:scale-98 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Chatear con el Baqueano IA sobre este Spot</span>
              </button>
            </div>
          </div>

          <SpotCapturasDestacadas capturas={capturasDestacadas} loading={loadingCapturas} />

          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <h2 className="text-2xl font-bold text-card-foreground mb-6 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-primary" />
              Estadísticas del Spot
            </h2>
            <EstadisticasSpot spotId={id!} />
          </div>

          <SpotTiposPesca 
            tiposPesca={estadisticas?.estadisticas?.tiposPescaMasUsados || []}
            totalCapturas={estadisticas?.estadisticas?.totalCapturas || 0}
            loading={loadingEstadisticas}
          />

          <div className="bg-card rounded-xl shadow-sm border border-border p-6">
            <h2 className="text-2xl font-bold text-card-foreground mb-4">
              Comentarios
            </h2>
            <ComentariosList idSpot={id!} />
          </div>
        </div>

        <SpotSidebar 
          estado={spot.estado}
          nombreSpot={spot.nombre}
          onRegistrarCaptura={() => setFormularioAbierto(true)}
        />
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
