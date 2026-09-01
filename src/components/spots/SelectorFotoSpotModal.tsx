import React, { useState, useEffect } from "react";
import { X, Search, Check, Loader2, Image as ImageIcon, Sparkles, AlertCircle } from "lucide-react";
import apiFishSpot from "../../api/apiFishSpot";

interface Props {
  spotId: string;
  spotNombre: string;
  imagenActual?: string;
  onClose: () => void;
  onFotoActualizada: (nuevaUrl: string) => void;
}

export const SelectorFotoSpotModal: React.FC<Props> = ({
  spotId,
  spotNombre,
  imagenActual,
  onClose,
  onFotoActualizada,
}) => {
  const [query, setQuery] = useState(spotNombre);
  const [fotos, setFotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [seleccionada, setSeleccionada] = useState<string>(imagenActual || "");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const buscarFotos = async (busqueda: string) => {
    try {
      setLoading(true);
      setError("");
      const res = await apiFishSpot.get(`/spot/${spotId}/buscar-fotos`, {
        params: { query: busqueda },
      });
      setFotos(res.data || []);
      if (res.data && res.data.length > 0 && !seleccionada) {
        setSeleccionada(res.data[0]);
      }
    } catch (err: any) {
      console.error(err);
      setError("No se pudieron obtener imágenes para este spot. Probá con otra búsqueda.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarFotos(spotNombre);
  }, [spotId, spotNombre]);

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      buscarFotos(query.trim());
    }
  };

  const handleGuardar = async () => {
    if (!seleccionada) return;
    try {
      setGuardando(true);
      setError("");
      const res = await apiFishSpot.patch(`/spot/${spotId}/cambiar-portada`, {
        imagenUrl: seleccionada,
      });
      const nuevaUrl = res.data.imagenPortada || seleccionada;
      onFotoActualizada(nuevaUrl);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Error al actualizar la foto de portada.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-card rounded-3xl border border-border/80 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border/40 bg-muted/30">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-foreground">
                Elegir Foto Real para el Spot
              </h3>
              <p className="text-xs text-muted-foreground truncate max-w-sm">
                {spotNombre} (Solo Administradores)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Buscador interactivo */}
        <div className="p-5 pb-3 border-b border-border/30">
          <form onSubmit={handleBuscar} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar fotos web del pesquero (ej: Faro Querandí pesca)..."
                className="w-full pl-10 pr-4 py-2.5 bg-muted/50 border border-border/60 rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2.5 bg-primary text-primary-foreground font-bold text-xs rounded-xl hover:bg-primary/90 transition-all flex items-center gap-1.5 shrink-0 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>Buscar</span>
            </button>
          </form>
        </div>

        {/* Galería de fotos encontradas */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-xs text-muted-foreground">Buscando fotos reales en la web...</p>
            </div>
          ) : fotos.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground space-y-2">
              <ImageIcon className="w-10 h-10 mx-auto opacity-40" />
              <p className="text-xs">No se encontraron fotos con esa búsqueda. Intentá con otro término.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-[11px] font-bold text-muted-foreground">
                Seleccioná una imagen para guardar en Cloudinary como portada ({fotos.length} fotos):
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {fotos.map((url, idx) => {
                  const isSelected = seleccionada === url;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSeleccionada(url)}
                      className={`relative aspect-[4/3] rounded-2xl overflow-hidden border-2 transition-all group focus:outline-none ${
                        isSelected
                          ? "border-emerald-500 ring-4 ring-emerald-500/20 scale-[1.02] shadow-lg shadow-emerald-500/20"
                          : "border-border/60 hover:border-primary/60 opacity-80 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={url}
                        alt={`Foto ${idx + 1}`}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLElement).parentElement?.classList.add("hidden");
                        }}
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-emerald-600/30 backdrop-blur-[1px] flex items-center justify-center">
                          <div className="bg-emerald-500 text-white rounded-full p-1.5 shadow-md">
                            <Check className="w-4 h-4 stroke-[3]" />
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer con acciones */}
        <div className="p-4 border-t border-border/40 bg-muted/20 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={guardando}
            className="px-4 py-2.5 rounded-xl border border-border/60 font-bold text-xs text-foreground hover:bg-muted transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleGuardar}
            disabled={!seleccionada || guardando}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {guardando ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Guardando en Cloudinary...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Guardar Portada</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectorFotoSpotModal;
