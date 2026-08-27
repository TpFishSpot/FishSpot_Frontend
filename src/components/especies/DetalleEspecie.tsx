import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useDetalleEspecie } from "../../hooks/especies/useDetalleEspecie";
import { obtenerNombreMostrar } from "../../utils/especiesUtils";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useUserRoles } from "../../hooks/auth/useUserRoles";
import NavigationBar from "../common/NavigationBar";
import MobileNavigationBar from "../common/MobileNavigationBar";
import { ImagenResponsive } from "../common/imgenResponsive";
import apiFishSpot from "../../api/apiFishSpot";
import { Edit3, Check, X, Loader2, Upload, Sparkles, MapPin, Star } from "lucide-react";

export default function DetalleEspecie() {
  const { id } = useParams<{ id: string }>();
  const { especie, carnadas, tiposPesca, cargando, error } = useDetalleEspecie();
  const { isModerator, isAdmin } = useUserRoles();
  const [esFavorito, setEsFavorito] = useState(false);
  const [modalEditarAbierto, setModalEditarAbierto] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [errorEdicion, setErrorEdicion] = useState("");

  // Formulario de edición
  const [formData, setFormData] = useState({
    nombreComun: "",
    nombreCientifico: "",
    descripcion: "",
    imagen: "",
  });
  const [archivoFoto, setArchivoFoto] = useState<File | null>(null);
  const [previewFoto, setPreviewFoto] = useState<string>("");

  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();

  const manejarFavorito = () => setEsFavorito(!esFavorito);
  const manejarVolver = () => window.history.back();

  const irAlMapaConFiltro = () => {
    if (!especie) return;
    const nombreFiltro = obtenerNombreMostrar(especie as any);
    navigate(`/mapa?especie=${encodeURIComponent(nombreFiltro)}`);
  };

  const abrirModalEditar = () => {
    if (!especie) return;
    const primerNombreComun =
      Array.isArray(especie.nombre_comun) && especie.nombre_comun.length > 0
        ? especie.nombre_comun[0]
        : (especie as any).nombresComunes?.[0]?.nombre || "";

    setFormData({
      nombreComun: primerNombreComun,
      nombreCientifico: especie.nombre_cientifico || "",
      descripcion: especie.descripcion || "",
      imagen: especie.imagen || "",
    });
    setPreviewFoto(especie.imagen || "");
    setArchivoFoto(null);
    setErrorEdicion("");
    setModalEditarAbierto(true);
  };

  const handleGuardarEdicion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!especie) return;

    try {
      setGuardando(true);
      setErrorEdicion("");

      const data = new FormData();
      data.append("nombreComun", formData.nombreComun);
      data.append("nombreCientifico", formData.nombreCientifico);
      data.append("descripcion", formData.descripcion);
      if (formData.imagen) {
        data.append("imagen", formData.imagen);
      }
      if (archivoFoto) {
        data.append("foto", archivoFoto);
      }

      await apiFishSpot.patch(`/especie/${especie.id}/actualizar`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await queryClient.invalidateQueries({ queryKey: ["especie-complete", id] });
      await queryClient.invalidateQueries({ queryKey: ["especies"] });

      setModalEditarAbierto(false);
    } catch (err: any) {
      console.error(err);
      setErrorEdicion(err.response?.data?.message || "Error al actualizar la especie.");
    } finally {
      setGuardando(false);
    }
  };

  if (cargando)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Cargando detalles de la especie...</p>
        </div>
      </div>
    );

  if (error || !especie)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center bg-card p-6 rounded-2xl border border-border/50 max-w-sm w-full space-y-4 shadow-xl">
          <p className="text-sm text-destructive font-semibold">{error || "Especie no encontrada"}</p>
          <button
            onClick={manejarVolver}
            className="w-full py-2.5 bg-primary text-primary-foreground font-bold rounded-xl text-xs uppercase tracking-wider"
          >
            Volver a la guía
          </button>
        </div>
      </div>
    );

  // Normalizar nombres comunes para renderizado
  const nombresComunesList: string[] = Array.isArray(especie.nombre_comun)
    ? especie.nombre_comun
    : (especie as any).nombresComunes?.map((n: any) => (typeof n === "string" ? n : n.nombre)) || [];

  const nombrePrincipal = nombresComunesList.length > 0 ? nombresComunesList[0] : especie.nombre_cientifico;

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 text-foreground transition-colors"
      style={
        isMobile
          ? {
              paddingBottom: "max(96px, calc(96px + env(safe-area-inset-bottom)))",
            }
          : {}
      }
    >
      {isMobile ? <MobileNavigationBar /> : <NavigationBar />}

      {/* Header */}
      <div
        className="bg-card border-b border-border/50 shadow-sm transition-colors"
        style={
          isMobile
            ? {
                marginTop: "max(56px, calc(56px + env(safe-area-inset-top)))",
              }
            : {}
        }
      >
        <div
          className={`max-w-6xl mx-auto flex items-center justify-between ${
            isMobile ? "px-3 py-4" : "px-4 py-6"
          }`}
        >
          <div className="flex items-center gap-3">
            {isMobile && (
              <button
                onClick={manejarVolver}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/60 hover:bg-muted rounded-xl text-xs font-bold text-foreground border border-border/40 transition-all active:scale-95"
              >
                ← Volver
              </button>
            )}
            <div>
              <h1
                className={`font-black tracking-tight text-foreground ${
                  isMobile ? "text-lg" : "text-3xl"
                }`}
              >
                {nombrePrincipal}
              </h1>
              <p className="text-xs text-muted-foreground italic font-medium">
                {especie.nombre_cientifico}
              </p>
            </div>
          </div>

          <div className={`flex items-center gap-2 ${isMobile ? "" : "gap-3"}`}>
            {(isAdmin || isModerator) && (
              <button
                onClick={abrirModalEditar}
                className={`rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 ${
                  isMobile ? "px-3 py-2 text-xs" : "px-4 py-2 text-sm"
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                {!isMobile && "Editar Especie"}
              </button>
            )}

            <button
              onClick={irAlMapaConFiltro}
              className={`rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-primary/10 active:scale-95 ${
                isMobile ? "px-3 py-2 text-xs" : "px-4 py-2 text-sm"
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              {!isMobile && "Dónde pescar"}
            </button>

            <button
              onClick={manejarFavorito}
              className={`rounded-xl font-bold transition-all flex items-center justify-center gap-1 active:scale-95 ${
                esFavorito
                  ? "bg-yellow-400 text-yellow-950 shadow-md shadow-yellow-400/20"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground border border-border/40"
              } ${isMobile ? "px-3 py-2 text-xs" : "px-4 py-2 text-sm"}`}
            >
              <Star className={`w-3.5 h-3.5 ${esFavorito ? "fill-current" : ""}`} />
              {!isMobile && (esFavorito ? "Favorito" : "Guardar")}
            </button>

            {!isMobile && (
              <button
                onClick={manejarVolver}
                className="px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 font-bold text-sm text-foreground border border-border/40 transition-colors"
              >
                Volver
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div
        className={`max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 ${
          isMobile ? "px-3 py-4 gap-4" : "px-4 py-8 gap-8"
        }`}
      >
        <div className={`lg:col-span-2 ${isMobile ? "space-y-4" : "space-y-6"}`}>
          {/* Card de Imagen */}
          <div
            className={`bg-card/80 backdrop-blur-sm rounded-3xl shadow-sm border border-border/50 flex justify-center items-center transition-colors relative overflow-hidden group ${
              isMobile ? "p-6 min-h-[220px]" : "p-8 min-h-[280px]"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent pointer-events-none" />
            <ImagenResponsive
              src={especie.imagen || "/colorful-fish-shoal.png"}
              alt={especie.nombre_cientifico}
              aspectRatio="auto"
              objectFit="contain"
              className={`transition-transform duration-500 group-hover:scale-105 ${
                isMobile ? "max-h-48 max-w-[85%]" : "max-h-64 max-w-[85%]"
              }`}
            />
          </div>

          {/* Descripción */}
          <div
            className={`bg-card rounded-3xl shadow-sm border border-border/50 transition-colors ${
              isMobile ? "p-4" : "p-6"
            }`}
          >
            <h2
              className={`font-black text-foreground mb-3 flex items-center gap-2 ${
                isMobile ? "text-base" : "text-xl mb-4"
              }`}
            >
              <span className="text-emerald-500">📖</span> Descripción Biológica
            </h2>
            <p
              className={`text-muted-foreground leading-relaxed font-normal ${
                isMobile ? "text-xs" : "text-sm"
              }`}
            >
              {especie.descripcion}
            </p>
          </div>

          {/* Nombres Comunes */}
          <div
            className={`bg-card rounded-3xl shadow-sm border border-border/50 transition-colors ${
              isMobile ? "p-4" : "p-6"
            }`}
          >
            <h2
              className={`font-black text-foreground mb-3 flex items-center gap-2 ${
                isMobile ? "text-base" : "text-xl mb-4"
              }`}
            >
              <span className="text-blue-500">📝</span> Nombres Comunes y Populares
            </h2>
            {nombresComunesList.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {nombresComunesList.map((nombre, i) => (
                  <span
                    key={i}
                    className={`bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl font-bold ${
                      isMobile ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-xs"
                    }`}
                  >
                    {nombre}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">No especificados</p>
            )}
          </div>

          {/* Carnadas Recomendadas */}
          <div
            className={`bg-card rounded-3xl shadow-sm border border-border/50 transition-colors ${
              isMobile ? "p-4" : "p-6"
            }`}
          >
            <h2
              className={`font-black text-foreground mb-3 flex items-center gap-2 ${
                isMobile ? "text-base" : "text-xl mb-4"
              }`}
            >
              <span className="text-rose-500">🪱</span> Carnadas y Señuelos Recomendados
            </h2>
            {carnadas && carnadas.length > 0 ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-foreground font-medium">
                {carnadas.map((c) => (
                  <li
                    key={c.idCarnada}
                    className="flex items-center gap-2 bg-muted/40 p-2.5 rounded-xl border border-border/30"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <span>{c.nombre}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                Aún no hay carnadas específicas registradas para esta especie.
              </p>
            )}
          </div>

          {/* Modalidades / Tipos de Pesca */}
          <div
            className={`bg-card rounded-3xl shadow-sm border border-border/50 transition-colors ${
              isMobile ? "p-4" : "p-6"
            }`}
          >
            <h2
              className={`font-black text-foreground mb-3 flex items-center gap-2 ${
                isMobile ? "text-base" : "text-xl mb-4"
              }`}
            >
              <span className="text-purple-500">🎣</span> Modalidades de Pesca
            </h2>
            {tiposPesca && tiposPesca.length > 0 ? (
              <div className="space-y-3">
                {tiposPesca.map(({ id, nombre, descripcion }) => (
                  <div
                    key={id}
                    className="bg-muted/40 p-3 rounded-2xl border border-border/30 space-y-1"
                  >
                    <span className="font-bold text-xs text-foreground block">{nombre}</span>
                    {descripcion && (
                      <p className="text-[11px] text-muted-foreground leading-relaxed font-normal">
                        {descripcion}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                Aún no hay modalidades específicas vinculadas a esta especie.
              </p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className={isMobile ? "space-y-4" : "space-y-6"}>
          <div
            className={`bg-card rounded-3xl shadow-sm border border-border/50 transition-colors ${
              isMobile ? "p-4" : "p-6"
            }`}
          >
            <h3
              className={`font-black text-foreground mb-3 flex items-center gap-2 ${
                isMobile ? "text-sm" : "text-lg mb-4"
              }`}
            >
              <Sparkles className="w-4 h-4 text-primary" /> Ficha de Identificación
            </h3>
            <div className="space-y-2.5 text-xs text-muted-foreground">
              <p>
                <strong className="text-foreground font-semibold">ID Especie:</strong> {especie.id}
              </p>
              <p>
                <strong className="text-foreground font-semibold">Estado en Guía:</strong> Activo
              </p>
              <p className="pt-2 border-t border-border/20 text-[11px] leading-relaxed">
                Podés registrar capturas de este ejemplar seleccionándolo directamente en el formulario de nueva captura.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Edición de Administrador */}
      {modalEditarAbierto && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-lg rounded-3xl border border-border/60 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Cabecera Modal */}
            <div className="px-6 py-4 border-b border-border/40 flex items-center justify-between bg-muted/20">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-foreground">Editar Especie</h3>
                  <p className="text-[10px] text-muted-foreground">Panel de Administrador</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalEditarAbierto(false)}
                className="p-1.5 rounded-full hover:bg-muted text-muted-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleGuardarEdicion} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {errorEdicion && (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold">
                  {errorEdicion}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Nombre Común Principal</label>
                <input
                  type="text"
                  required
                  value={formData.nombreComun}
                  onChange={(e) => setFormData({ ...formData, nombreComun: e.target.value })}
                  placeholder="Ej: Tiburón Bacota"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-muted/40 border border-border/60 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Nombre Científico</label>
                <input
                  type="text"
                  required
                  value={formData.nombreCientifico}
                  onChange={(e) => setFormData({ ...formData, nombreCientifico: e.target.value })}
                  placeholder="Ej: Carcharhinus brachyurus"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-muted/40 border border-border/60 text-xs text-foreground italic focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground">Descripción</label>
                <textarea
                  rows={4}
                  required
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Descripción biológica orientada a la pesca deportiva..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-muted/40 border border-border/60 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none leading-relaxed"
                />
              </div>

              {/* Imagen / Subida */}
              <div className="space-y-2 pt-2 border-t border-border/30">
                <label className="text-xs font-bold text-foreground block">Foto de la Especie (Cloudinary)</label>
                
                {previewFoto && (
                  <div className="flex items-center gap-3 bg-muted/30 p-2.5 rounded-2xl border border-border/40">
                    <img
                      src={previewFoto}
                      alt="Preview"
                      className="w-16 h-12 object-contain bg-background/50 rounded-xl border border-border/40"
                    />
                    <div className="text-[10px] text-muted-foreground flex-1 truncate">
                      <span className="font-semibold text-foreground block">Imagen actual / seleccionada:</span>
                      <span className="truncate block opacity-80">{previewFoto}</span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-muted/60 hover:bg-muted border border-border/60 text-xs font-semibold text-foreground cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5 text-primary" />
                    <span>Subir archivo PNG</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setArchivoFoto(file);
                          setPreviewFoto(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </label>

                  <input
                    type="url"
                    value={formData.imagen}
                    onChange={(e) => {
                      setFormData({ ...formData, imagen: e.target.value });
                      setPreviewFoto(e.target.value);
                      setArchivoFoto(null);
                    }}
                    placeholder="O pegar URL web..."
                    className="w-full px-3 py-2 rounded-xl bg-muted/40 border border-border/60 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border/40">
                <button
                  type="button"
                  disabled={guardando}
                  onClick={() => setModalEditarAbierto(false)}
                  className="px-4 py-2.5 rounded-xl font-bold text-xs text-muted-foreground hover:bg-muted transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardando}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
                >
                  {guardando ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
