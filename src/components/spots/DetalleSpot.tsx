import { useState } from "react"
import { useParams } from "react-router-dom"
import ListaEspecies from "../especies/ListaEspecies"
import SpotHeader from "./SpotHeader"
import { useDetalleSpot } from "../../hooks/spots/useDetalleSpot"
import { obtenerCoordenadas } from "../../utils/spotUtils"
import { ComentariosList } from "../comentario/ComentariosList"
import { useCapturasDestacadas } from "../../hooks/capturas/useCapturasDestacadas"
import { BarChart3 } from "lucide-react"
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
