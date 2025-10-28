import { FishIcon } from 'lucide-react'

interface SpotSidebarProps {
  estado: string
  nombreSpot: string
  onRegistrarCaptura: () => void
}

export const SpotSidebar = ({ estado, nombreSpot, onRegistrarCaptura }: SpotSidebarProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl shadow-sm border border-border p-6">
        <h3 className="text-xl font-bold text-card-foreground mb-4 flex items-center gap-2">
          <span className="text-emerald-500">🎯</span>
          Estado del Spot
        </h3>
        <div
          className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-semibold ${
            estado === "Aceptado"
              ? "bg-green-100 text-green-800"
              : estado === "Inactivo"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full mr-2 ${
              estado === "Aceptado"
                ? "bg-green-500"
                : estado === "Inactivo"
                  ? "bg-red-500"
                  : "bg-yellow-500"
            }`}
          ></span>
          {estado}
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
          onClick={onRegistrarCaptura}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
        >
          <FishIcon className="w-5 h-5" />
          Registrar Captura Aquí
        </button>
      </div>
    </div>
  )
}
