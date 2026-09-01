import React, { useState } from "react";
import { X, Loader2, Sparkles, CheckCircle2, AlertCircle, HelpCircle } from "lucide-react";
import apiFishSpot from "../../api/apiFishSpot";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialNombre?: string;
  initialTipo?: "Especie" | "TipoPesca" | "Carnada";
}

export const SugerirModal: React.FC<Props> = ({
  isOpen,
  onClose,
  initialNombre = "",
  initialTipo = "Especie",
}) => {
  const [tipo, setTipo] = useState<"Especie" | "TipoPesca" | "Carnada">(initialTipo);
  const [nombre, setNombre] = useState(initialNombre);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      if (initialNombre) setNombre(initialNombre);
      if (initialTipo) setTipo(initialTipo);
      setError("");
      setExito(false);
    }
  }, [isOpen, initialNombre, initialTipo]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || cargando) return;

    try {
      setCargando(true);
      setError("");
      
      await apiFishSpot.post("/sugerencia", {
        tipo,
        nombre: nombre.trim(),
      });

      setExito(true);
      setNombre("");
      setTimeout(() => {
        setExito(false);
        onClose();
      }, 2500);
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message || 
        "Hubo un problema al enviar tu sugerencia. Intenta de nuevo."
      );
    } finally {
      setCargando(false);
    }
  };

  const getTipoLabel = () => {
    if (tipo === "Especie") return "Nombre de la Especie (ej: Tiburón Escalandrún)";
    if (tipo === "TipoPesca") return "Modalidad de Pesca (ej: Fondeo de costa)";
    return "Nombre de la Carnada o Señuelo (ej: Filet de liza)";
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-3 bg-background/50 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
      <div className="relative flex flex-col w-full max-w-md rounded-3xl border border-primary/10 bg-background/95 shadow-3xl p-6 overflow-hidden text-foreground backdrop-blur-xl animate-in slide-in-from-bottom-6 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border/10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            <h3 className="font-extrabold text-lg text-foreground tracking-tight">Sugerir a FishSpot IA</h3>
          </div>
          <button
            onClick={onClose}
            disabled={cargando}
            className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all active:scale-95 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido / Formularios */}
        {exito ? (
          <div className="flex flex-col items-center justify-center py-8 text-center space-y-3 animate-in zoom-in-95">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 animate-bounce" />
            <h4 className="font-bold text-foreground text-base">¡Sugerencia Enviada!</h4>
            <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
              La IA completó con éxito la ficha técnica. El administrador la revisará para publicarla en la guía.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* Explicación breve */}
            <div className="flex items-start gap-2.5 rounded-2xl bg-primary/5 border border-primary/10 p-3.5 text-xs text-muted-foreground leading-relaxed">
              <HelpCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <p>
                ¿Falta algún pez, modalidad de pesca o carnada? Escribilo y nuestra <strong>Inteligencia Artificial</strong> buscará y autocompletará la ficha técnica.
              </p>
            </div>

            {/* Selector de Tipo */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">¿Qué querés sugerir?</label>
              <div className="grid grid-cols-3 gap-2">
                {(["Especie", "TipoPesca", "Carnada"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTipo(t)}
                    disabled={cargando}
                    className={`py-2 rounded-xl text-xs font-bold uppercase tracking-wide border transition-all active:scale-95 ${
                      tipo === t
                        ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/10"
                        : "bg-card border-border hover:bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t === "TipoPesca" ? "Modalidad" : t}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Nombre */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                {getTipoLabel()}
              </label>
              <input
                type="text"
                required
                disabled={cargando}
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Escribí tu propuesta..."
                className="w-full h-11 px-4 rounded-xl bg-muted/50 border border-border/40 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium transition-all"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 py-2 px-3 text-xs font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!nombre.trim() || cargando}
              className="flex items-center justify-center gap-2 w-full h-11 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/15 hover:bg-primary/95 transition-all active:scale-95 disabled:opacity-50 font-bold text-sm"
            >
              {cargando ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>La IA está analizando la sugerencia...</span>
                </>
              ) : (
                <span>Enviar Sugerencia</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
