import React, { useEffect, useState } from "react";
import { Check, X, Loader2, Sparkles, HelpCircle, Image as ImageIcon } from "lucide-react";
import apiFishSpot from "../../api/apiFishSpot";

interface Sugerencia {
  id: string;
  tipo: "Especie" | "TipoPesca" | "Carnada";
  nombre: string;
  detallesJson: string;
  estado: "Pendiente" | "Aprobado" | "Rechazado";
  createdAt: string;
  usuario?: {
    nombre: string;
  };
}

export const AdminSugerenciasTab: React.FC = () => {
  const [sugerencias, setSugerencias] = useState<Sugerencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [procesandoId, setProcesandoId] = useState<string | null>(null);
  const [imagenesSeleccionadas, setImagenesSeleccionadas] = useState<Record<string, string>>({});

  const cargarSugerencias = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await apiFishSpot.get("/sugerencia");
      setSugerencias(res.data);

      // Pre-seleccionar la primera imagen de cada sugerencia de especie
      const inicial: Record<string, string> = {};
      res.data.forEach((sug: Sugerencia) => {
        if (sug.tipo === "Especie") {
          try {
            const det = JSON.parse(sug.detallesJson);
            if (det.imagenesCandidatas && det.imagenesCandidatas.length > 0) {
              inicial[sug.id] = det.imagenesCandidatas[0];
            }
          } catch {
            // ignore
          }
        }
      });
      setImagenesSeleccionadas(inicial);
    } catch (err: any) {
      console.error(err);
      setError("Error al cargar las sugerencias de la IA.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarSugerencias();
  }, []);

  const handleSeleccionarImagen = (sugId: string, imgUrl: string) => {
    setImagenesSeleccionadas((prev) => ({
      ...prev,
      [sugId]: imgUrl,
    }));
  };

  const handleAprobar = async (sug: Sugerencia) => {
    try {
      setProcesandoId(sug.id);
      const imagenSeleccionada = imagenesSeleccionadas[sug.id];

      await apiFishSpot.patch(`/sugerencia/${sug.id}/aprobar`, {
        imagenSeleccionada,
      });

      setSugerencias((prev) => prev.filter((s) => s.id !== sug.id));
    } catch (err: any) {
      alert("Error al aprobar la sugerencia.");
    } finally {
      setProcesandoId(null);
    }
  };

  const handleRechazar = async (id: string) => {
    try {
      setProcesandoId(id);
      await apiFishSpot.patch(`/sugerencia/${id}/rechazar`);
      setSugerencias((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      alert("Error al rechazar la sugerencia.");
    } finally {
      setProcesandoId(null);
    }
  };

  const renderGaleriaImagenes = (sug: Sugerencia, imagenesCandidatas: string[]) => {
    const seleccionada = imagenesSeleccionadas[sug.id] || imagenesCandidatas[0];

    return (
      <div className="mt-3 pt-3 border-t border-border/20 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-foreground flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-primary" />
            Elegí la foto para la Guía ({imagenesCandidatas.length} fotos encontradas en la web):
          </span>
          {seleccionada && (
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <Check className="w-3 h-3" /> Foto elegida
            </span>
          )}
        </div>

        {/* Miniaturas de imágenes */}
        <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-10 gap-2">
          {imagenesCandidatas.map((url, idx) => {
            const isSelected = seleccionada === url;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSeleccionarImagen(sug.id, url)}
                className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all group focus:outline-none ${
                  isSelected
                    ? "border-emerald-500 ring-2 ring-emerald-500/30 scale-105 shadow-md shadow-emerald-500/20"
                    : "border-border/40 hover:border-primary/60 opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={url}
                  alt={`Candidata ${idx + 1}`}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    // Ocultar miniatura si el link externo falló
                    (e.target as HTMLElement).parentElement?.classList.add("hidden");
                  }}
                />
                {isSelected && (
                  <div className="absolute inset-0 bg-emerald-600/30 backdrop-blur-[1px] flex items-center justify-center">
                    <div className="bg-emerald-500 text-white rounded-full p-0.5 shadow">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Vista previa ampliada de la imagen seleccionada */}
        {seleccionada && (
          <div className="flex items-center gap-3 bg-muted/40 p-2 rounded-xl border border-border/30 mt-2">
            <img
              src={seleccionada}
              alt="Vista previa seleccionada"
              className="w-16 h-12 object-cover rounded-lg shadow-sm shrink-0 border border-border/40"
            />
            <div className="text-[10px] text-muted-foreground flex-1 truncate">
              <span className="font-semibold text-foreground block">Foto seleccionada para subir a Cloudinary:</span>
              <span className="truncate block opacity-70">{seleccionada}</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderDetalles = (sug: Sugerencia) => {
    try {
      const det = JSON.parse(sug.detallesJson);

      if (sug.tipo === "Especie") {
        const tieneImagenes = det.imagenesCandidatas && det.imagenesCandidatas.length > 0;

        return (
          <div className="space-y-1.5 text-xs text-muted-foreground leading-relaxed pt-2 border-t border-border/10">
            <p>
              <strong className="text-foreground font-semibold">Nombre Científico:</strong>{" "}
              <span className="italic">{det.nombreCientifico}</span>
            </p>
            <p>
              <strong className="text-foreground font-semibold">Nombres Comunes:</strong>{" "}
              {det.nombresComunes?.join(", ")}
            </p>
            <p className="line-clamp-2">
              <strong className="text-foreground font-semibold">Ficha Generada:</strong> {det.descripcion}
            </p>

            {/* Galería de imágenes */}
            {tieneImagenes && renderGaleriaImagenes(sug, det.imagenesCandidatas)}
          </div>
        );
      }

      if (sug.tipo === "Carnada") {
        return (
          <div className="space-y-1.5 text-xs text-muted-foreground leading-relaxed pt-2 border-t border-border/10">
            <p>
              <strong className="text-foreground font-semibold">Clasificación:</strong>{" "}
              <span className="font-semibold text-primary">{det.tipo}</span>
            </p>
            <p className="line-clamp-2">
              <strong className="text-foreground font-semibold">Descripción:</strong> {det.descripcion}
            </p>
          </div>
        );
      }

      return (
        <div className="space-y-1.5 text-xs text-muted-foreground leading-relaxed pt-2 border-t border-border/10">
          <p className="line-clamp-2">
            <strong className="text-foreground font-semibold">Descripción de Modalidad:</strong> {det.descripcion}
          </p>
        </div>
      );
    } catch {
      return <p className="text-xs text-destructive">Ficha corrupta o vacía.</p>;
    }
  };

  const getTipoBadge = (tipo: Sugerencia["tipo"]) => {
    const base = "text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border ";
    if (tipo === "Especie") {
      return <span className={`${base} bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20`}>Especie</span>;
    }
    if (tipo === "TipoPesca") {
      return <span className={`${base} bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20`}>Modalidad</span>;
    }
    return <span className={`${base} bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20`}>Carnada</span>;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Cargando sugerencias pendientes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-6 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-2xl px-4">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sugerencias.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-2xl border border-border/50 p-6 space-y-3">
          <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto" />
          <h3 className="font-bold text-foreground text-sm">Sin sugerencias pendientes</h3>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto">
            Cuando los usuarios propongan especies, modalidades o carnadas en la guía, aparecerán aquí para tu aprobación.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {sugerencias.map((sug) => (
            <div
              key={sug.id}
              className="relative bg-gradient-to-br from-card to-muted/10 rounded-2xl shadow-md border border-border/50 p-5 transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                
                {/* Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-base font-extrabold text-foreground tracking-tight">
                      {sug.nombre}
                    </h4>
                    {getTipoBadge(sug.tipo)}
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-primary px-1.5 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                      <Sparkles className="w-2.5 h-2.5" /> IA Completa
                    </span>
                  </div>

                  <p className="text-[10px] text-muted-foreground font-semibold">
                    Propuesto por: {sug.usuario?.nombre || "Usuario registrado"} |{" "}
                    {new Date(sug.createdAt).toLocaleDateString()}
                  </p>

                  {/* Detalles autogenerados */}
                  {renderDetalles(sug)}
                </div>

                {/* Acciones */}
                <div className="flex sm:flex-nowrap gap-2 self-end md:self-start shrink-0 pt-1">
                  <button
                    disabled={procesandoId !== null}
                    onClick={() => handleAprobar(sug)}
                    className="inline-flex items-center gap-1.5 min-h-[38px] px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/10 transition-all active:scale-95 disabled:opacity-50 shrink-0"
                  >
                    {procesandoId === sug.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                    Aprobar
                  </button>
                  <button
                    disabled={procesandoId !== null}
                    onClick={() => handleRechazar(sug.id)}
                    className="inline-flex items-center gap-1.5 min-h-[38px] px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/10 transition-all active:scale-95 disabled:opacity-50 shrink-0"
                  >
                    {procesandoId === sug.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <X className="w-3.5 h-3.5" />
                    )}
                    Rechazar
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
