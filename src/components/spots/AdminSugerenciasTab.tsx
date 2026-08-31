import React, { useEffect, useState } from "react";
import { Check, X, Loader2, Sparkles, HelpCircle, Image as ImageIcon, CheckCircle2, AlertCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
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
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [mensajeError, setMensajeError] = useState<string | null>(null);
  const [procesandoId, setProcesandoId] = useState<string | null>(null);
  const [imagenesSeleccionadas, setImagenesSeleccionadas] = useState<Record<string, string>>({});

  const queryClient = useQueryClient();

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
      setMensajeError(null);
      setMensajeExito(null);
      const imagenSeleccionada = imagenesSeleccionadas[sug.id];

      await apiFishSpot.patch(`/sugerencia/${sug.id}/aprobar`, {
        imagenSeleccionada,
      });

      // Invalidar caché de especies para que se actualice la guía en tiempo real
      await queryClient.invalidateQueries({ queryKey: ["especies"] });
      await queryClient.invalidateQueries({ queryKey: ["especie-complete"] });

      setSugerencias((prev) => prev.filter((s) => s.id !== sug.id));
      setMensajeExito(`¡"${sug.nombre}" fue aprobada e incorporada con éxito!`);
      setTimeout(() => setMensajeExito(null), 4000);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Error al aprobar la sugerencia.";
      setMensajeError(msg);
      setTimeout(() => setMensajeError(null), 5000);
    } finally {
      setProcesandoId(null);
    }
  };

  const handleRechazar = async (sug: Sugerencia) => {
    try {
      setProcesandoId(sug.id);
      setMensajeError(null);
      setMensajeExito(null);

      await apiFishSpot.patch(`/sugerencia/${sug.id}/rechazar`);

      setSugerencias((prev) => prev.filter((s) => s.id !== sug.id));
      setMensajeExito(`Sugerencia "${sug.nombre}" rechazada.`);
      setTimeout(() => setMensajeExito(null), 3000);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Error al rechazar la sugerencia.";
      setMensajeError(msg);
      setTimeout(() => setMensajeError(null), 5000);
    } finally {
      setProcesandoId(null);
    }
  };

  const renderGaleriaImagenes = (sug: Sugerencia, imagenesCandidatas: string[]) => {
    const seleccionada = imagenesSeleccionadas[sug.id] || imagenesCandidatas[0];

    return (
      <div className="mt-3 pt-3 border-t border-border/40 space-y-2.5">
        <div className="flex items-center justify-between flex-wrap gap-1">
          <span className="text-[11px] font-bold text-foreground flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-primary" />
            Elegí la foto para la Guía ({imagenesCandidatas.length} encontradas en la web):
          </span>
          {seleccionada && (
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <Check className="w-3 h-3 stroke-[3]" /> Foto elegida
            </span>
          )}
        </div>

        {/* Miniaturas de imágenes */}
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-2">
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
                title={`Seleccionar foto ${idx + 1}`}
              >
                <img
                  src={url}
                  alt={`Candidata ${idx + 1}`}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
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
          <div className="flex items-center gap-3 bg-muted/50 p-2.5 rounded-xl border border-border/40 mt-2">
            <img
              src={seleccionada}
              alt="Vista previa seleccionada"
              className="w-16 h-12 object-cover rounded-lg shadow-sm shrink-0 border border-border/40"
            />
            <div className="text-[10px] text-muted-foreground flex-1 min-w-0">
              <span className="font-semibold text-foreground block">Foto seleccionada:</span>
              <span className="truncate block opacity-75">{seleccionada}</span>
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
          <div className="space-y-2 text-xs text-muted-foreground leading-relaxed pt-2 border-t border-border/40">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <p>
                <strong className="text-foreground font-semibold">Nombre Científico:</strong>{" "}
                <span className="italic">{det.nombreCientifico}</span>
              </p>
              <p>
                <strong className="text-foreground font-semibold">Nombres Comunes:</strong>{" "}
                {det.nombresComunes?.join(", ")}
              </p>
            </div>

            {det.carnadas && det.carnadas.length > 0 && (
              <p>
                <strong className="text-foreground font-semibold">Carnadas Sugeridas:</strong>{" "}
                {det.carnadas.join(", ")}
              </p>
            )}

            {det.tiposPesca && det.tiposPesca.length > 0 && (
              <p>
                <strong className="text-foreground font-semibold">Modalidades:</strong>{" "}
                {det.tiposPesca.map((t: any) => (typeof t === "string" ? t : t.nombre)).join(", ")}
              </p>
            )}

            <p className="line-clamp-3">
              <strong className="text-foreground font-semibold">Ficha Generada:</strong> {det.descripcion}
            </p>

            {/* Galería de imágenes */}
            {tieneImagenes && renderGaleriaImagenes(sug, det.imagenesCandidatas)}
          </div>
        );
      }

      if (sug.tipo === "Carnada") {
        return (
          <div className="space-y-2 text-xs text-muted-foreground leading-relaxed pt-2 border-t border-border/40">
            <p>
              <strong className="text-foreground font-semibold">Clasificación:</strong>{" "}
              <span className="font-semibold text-primary">{det.tipo}</span>
            </p>
            <p className="line-clamp-3">
              <strong className="text-foreground font-semibold">Descripción:</strong> {det.descripcion}
            </p>
          </div>
        );
      }

      return (
        <div className="space-y-2 text-xs text-muted-foreground leading-relaxed pt-2 border-t border-border/40">
          <p className="line-clamp-3">
            <strong className="text-foreground font-semibold">Descripción de Modalidad:</strong> {det.descripcion}
          </p>
        </div>
      );
    } catch {
      return <p className="text-xs text-destructive">Ficha corrupta o vacía.</p>;
    }
  };

  const getTipoBadge = (tipo: Sugerencia["tipo"]) => {
    const base = "text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ";
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
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
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
    <div className="space-y-4 max-w-5xl mx-auto px-1 sm:px-0">
      {/* Toast Feedback Messages */}
      {mensajeExito && (
        <div className="flex items-center gap-2 p-3.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300 rounded-2xl text-xs font-semibold animate-in fade-in slide-in-from-top-2 shadow-sm">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{mensajeExito}</span>
        </div>
      )}

      {mensajeError && (
        <div className="flex items-center gap-2 p-3.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 text-rose-700 dark:text-rose-300 rounded-2xl text-xs font-semibold animate-in fade-in slide-in-from-top-2 shadow-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{mensajeError}</span>
        </div>
      )}

      {sugerencias.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-3xl border border-border/50 p-8 space-y-3 shadow-sm">
          <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto opacity-60" />
          <h3 className="font-bold text-foreground text-base">Sin sugerencias pendientes</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
            Cuando los usuarios propongan nuevas especies, modalidades o carnadas, aparecerán aquí con sus fichas autogeneradas por la IA para su revisión y aprobación.
          </p>
        </div>
      ) : (
        <div className="grid gap-5">
          {sugerencias.map((sug) => {
            const procesandoEste = procesandoId === sug.id;
            return (
              <div
                key={sug.id}
                className="relative bg-card rounded-3xl shadow-md border border-border/60 p-5 sm:p-6 transition-all duration-200 hover:shadow-xl space-y-4"
              >
                {/* Header del Card */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/40">
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-lg font-black text-foreground tracking-tight truncate">
                        {sug.nombre}
                      </h4>
                      {getTipoBadge(sug.tipo)}
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                        <Sparkles className="w-3 h-3" /> Ficha IA
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground font-medium">
                      Propuesto por: <strong className="text-foreground">{sug.usuario?.nombre || "Usuario registrado"}</strong> •{" "}
                      {new Date(sug.createdAt).toLocaleDateString("es-AR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Botones de acción en Desktop */}
                  <div className="hidden sm:flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      disabled={procesandoId !== null}
                      onClick={() => handleRechazar(sug)}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 transition-all active:scale-95 disabled:opacity-50"
                      title="Rechazar y descartar sugerencia"
                    >
                      {procesandoEste ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <X className="w-3.5 h-3.5" />}
                      <span>Rechazar</span>
                    </button>

                    <button
                      type="button"
                      disabled={procesandoId !== null}
                      onClick={() => handleAprobar(sug)}
                      className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all active:scale-95 disabled:opacity-50"
                      title="Aprobar y publicar en la Guía"
                    >
                      {procesandoEste ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                      <span>Aprobar Ficha</span>
                    </button>
                  </div>
                </div>

                {/* Detalles de la Ficha generada */}
                <div className="space-y-3">
                  {renderDetalles(sug)}
                </div>

                {/* Botones de acción en Mobile (Siempre visibles y accesibles al pie del card) */}
                <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-border/40 sm:hidden">
                  <button
                    type="button"
                    disabled={procesandoId !== null}
                    onClick={() => handleRechazar(sug)}
                    className="inline-flex items-center justify-center gap-1.5 w-full py-3 rounded-2xl font-bold text-xs uppercase tracking-wider bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {procesandoEste ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                    <span>Rechazar</span>
                  </button>

                  <button
                    type="button"
                    disabled={procesandoId !== null}
                    onClick={() => handleAprobar(sug)}
                    className="inline-flex items-center justify-center gap-1.5 w-full py-3 rounded-2xl font-bold text-xs uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {procesandoEste ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 stroke-[2.5]" />}
                    <span>Aprobar</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminSugerenciasTab;
