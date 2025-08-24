import { ArrowLeft, Upload, MapPin, Loader2, Camera } from "lucide-react";
import { useCrearSpot } from "../hooks/useCrearSpot";
import ListaEspeciesSeleccion from "./ListaEspeciesSeleccion";
import SeleccionCarnadaTipoPesca from "./SeleccionCarnadaTipoPesca";

export function CrearSpot() {
  const {
    nombre, setNombre,
    descripcion, setDescripcion,
    imagePreview, handleImageChange, clearImage,
    errors, isLoading, handleSubmit,
    lat, lng, navigate,
    especies, addEspecie, removeEspecie,
    todasEspecies,
    carnadas, setCarnadas,
    tiposPesca, setTiposPesca
  } = useCrearSpot();

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-card shadow-md hover:shadow-lg transition-shadow"
          >
            <ArrowLeft className="w-5 h-5 text-primary" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-card-foreground">Crear Nuevo Spot</h1>
            <p className="text-muted-foreground">Comparte tu lugar de pesca favorito</p>
          </div>
        </div>

        {lat !== undefined && lng !== undefined ? (
          <div className="bg-card rounded-lg p-4 mb-6 shadow-sm border border-border">
            <div className="flex items-center gap-2 text-foreground">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">Ubicación seleccionada:</span>
              <span className="text-sm font-mono">{lat.toFixed(6)}, {lng.toFixed(6)}</span>
            </div>
          </div>
        ) : (
          <div className="bg-card rounded-lg p-4 mb-6 shadow-sm border border-border text-sm text-gray-400">
            Ubicación no disponible
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-card rounded-xl shadow-lg p-6 space-y-6">
        
          <div className="space-y-2">
            <label htmlFor="nombre" className="block text-sm font-semibold text-card-foreground">Nombre del Spot *</label>
            <input
              id="nombre"
              type="text"
              value={nombre}
              onChange={(e) => { setNombre(e.target.value); if (errors.nombre) errors.nombre = ""; }}
              placeholder="Ej: Bahía del Pescador"
              className={`w-full px-4 py-3 border-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-card text-card-foreground border-border ${errors.nombre ? "border-destructive bg-destructive-foreground/10" : "hover:border-primary"}`}
            />
            {errors.nombre && <p className="text-destructive text-sm">{errors.nombre}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="descripcion" className="block text-sm font-semibold text-card-foreground">Descripción *</label>
            <textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => { setDescripcion(e.target.value); if (errors.descripcion) errors.descripcion = ""; }}
              placeholder="Describe el spot: tipo de peces, mejores horarios, acceso, etc."
              rows={4}
              className={`w-full px-4 py-3 border-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none bg-card text-card-foreground border-border ${errors.descripcion ? "border-destructive bg-destructive-foreground/10" : "hover:border-primary"}`}
            />
            {errors.descripcion && <p className="text-destructive text-sm">{errors.descripcion}</p>}
          </div>

          
         <div className="space-y-2">
        <label className="block text-sm font-semibold text-card-foreground">Especies capturadas *</label>
        <ListaEspeciesSeleccion
        todasEspecies={todasEspecies}
        especiesSeleccionadas={especies}
        addEspecie={addEspecie}
        removeEspecie={removeEspecie}
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-card-foreground">Carnadas y técnicas de pesca</label>
        <SeleccionCarnadaTipoPesca
          especiesSeleccionadas={especies}
          carnadasSeleccionadas={carnadas}
          tiposPescaSeleccionados={tiposPesca}
          onCarnadaChange={setCarnadas}
          onTipoPescaChange={setTiposPesca}
        />
      </div>

          
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-card-foreground">Imagen del Spot</label>
            <div className="space-y-4">
              {imagePreview ? (
                <div className="relative">
                  <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg border-2 border-border" />
                  <button type="button" onClick={clearImage} className="absolute top-2 right-2 bg-destructive text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-destructive/80 transition-colors">×</button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer bg-card hover:bg-card/90 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Camera className="w-10 h-10 mb-3 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Haz clic para subir</span> una imagen
                    </p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </label>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={() => navigate(-1)} className="flex-1 px-6 py-3 border-2 border-border text-card-foreground rounded-lg hover:bg-card/50 transition-colors font-medium" disabled={isLoading}>Cancelar</button>
            <button type="submit" disabled={isLoading} className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? (<><Loader2 className="w-4 h-4 animate-spin" /> Creando...</>) : (<><Upload className="w-4 h-4" /> Crear Spot</>)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
