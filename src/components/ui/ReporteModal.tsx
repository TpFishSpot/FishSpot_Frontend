import { useState } from "react";
import apiFishSpot from "../../api/apiFishSpot";

interface ReporteModalProps {
  spotId: string;
  onClose: () => void;
}

export default function ReporteModal({ spotId, onClose }: ReporteModalProps) {
  const [descripcion, setDescripcion] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!descripcion.trim()) return;
    setLoading(true);
    try {
      await apiFishSpot.post(
        `/reportes`,
        { idSpot: spotId, descripcion },
        { withCredentials: true }
      );
      setMensaje("Reporte enviado ✅");
      setDescripcion("");
      setTimeout(() => onClose(), 1000);
    } catch (error: any) {
      setMensaje(error.response?.data?.message || "Error al enviar ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-card text-card-foreground p-6 rounded-xl shadow-lg w-96">
        <h3 className="text-lg font-bold mb-4">Reportar Spot</h3>
        <textarea
          className="w-full border border-border rounded p-2 mb-4 bg-card text-card-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition-all duration-200"
          rows={4}
          placeholder="Describe el problema..."
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded bg-muted-foreground/20 hover:bg-muted-foreground/30 text-card-foreground"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Enviando..." : "Enviar"}
          </button>
        </div>
        {mensaje && <p className="mt-2 text-sm">{mensaje}</p>}
      </div>
    </div>
  );
}
