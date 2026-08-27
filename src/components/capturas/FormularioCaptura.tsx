import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Camera,
  Upload,
  Calendar,
  Clock,
  MapPin,
  Ruler,
  Weight,
  Fish,
  Target,
  Navigation,
  Loader2,
  Check,
  Search,
  Sparkles,
  Info,
  Layers,
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useEspecies } from '../../hooks/especies/useEspecies';
import { useCarnadas } from '../../hooks/carnadas/useCarnadas';
import { useTiposPesca } from '../../hooks/carnadas/useTiposPesca';
import { useGeolocalizacion } from '../../hooks/ui/useGeolocalizacion';
import { useNavigate, useLocation } from 'react-router-dom';
import { obtenerNombreMostrar } from '../../utils/especiesUtils';
import { compressImage } from '../../utils/imageCompression';
import { useIsMobile } from '../../hooks/useIsMobile';
import 'leaflet/dist/leaflet.css';

interface NuevaCapturaData {
  especieId: string;
  especieNombre: string;
  fecha: string;
  ubicacion: string;
  spotId?: string;
  latitud?: number;
  longitud?: number;
  peso?: number;
  tamanio?: number;
  carnada: string;
  tipoPesca: string;
  foto?: File;
  notas?: string;
  clima?: string;
  horaCaptura?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (captura: NuevaCapturaData) => void;
  coordenadasSpot?: { latitud: number; longitud: number };
  nombreSpot?: string;
}

const STORAGE_KEY = 'fishspot_captura_draft';

// Componente para capturar clics en el mini mapa embebido
function MiniMapClickHandler({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

const markerIcon = L.divIcon({
  className: 'custom-capture-pin',
  html: '<div style="background: linear-gradient(135deg, #10b981, #059669); width: 22px; height: 22px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center;"><div style="width: 6px; height: 6px; background: white; border-radius: 50%;"></div></div>',
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

const climas = [
  { id: 'Soleado', label: 'Soleado', icon: '☀️' },
  { id: 'Nublado', label: 'Nublado', icon: '⛅' },
  { id: 'Lluvioso', label: 'Lluvia', icon: '🌧️' },
  { id: 'Ventoso', label: 'Viento', icon: '💨' },
  { id: 'Mar picado', label: 'Mar picado', icon: '🌊' },
  { id: 'Tormentoso', label: 'Tormenta', icon: '⚡' },
];

const FormularioCaptura: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  coordenadasSpot,
  nombreSpot,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { position, cargandoPosicion, esUbicacionUsuario } = useGeolocalizacion();
  const isMobile = useIsMobile();

  // 1. Cargar borrador persistido para evitar pérdida de datos al cambiar de ubicación
  const [formData, setFormData] = useState<NuevaCapturaData>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return {
      especieId: '',
      especieNombre: '',
      fecha: new Date().toISOString().split('T')[0],
      ubicacion: '',
      carnada: '',
      tipoPesca: '',
      horaCaptura: new Date().toTimeString().slice(0, 5),
    };
  });

  const [fotoPreview, setFotoPreview] = useState<string>(() => {
    return sessionStorage.getItem(`${STORAGE_KEY}_preview`) || '';
  });
  const [gpsConfirmado, setGpsConfirmado] = useState(false);
  const [gpsRechazado, setGpsRechazado] = useState(false);
  const [mostrarMiniMapa, setMostrarMiniMapa] = useState(false);
  const [busquedaEspecie, setBusquedaEspecie] = useState('');
  const [guardandoForm, setGuardandoForm] = useState(false);

  const esDesdeSpot = !!coordenadasSpot;

  const { especies, loading: loadingEspecies, error: errorEspecies } = useEspecies();
  const { carnadas, loading: loadingCarnadas, error: errorCarnadas } = useCarnadas();
  const { tiposPesca, loading: loadingTipos, error: errorTipos } = useTiposPesca();

  const isLoadingData = loadingEspecies || loadingCarnadas || loadingTipos;
  const hasErrors = errorEspecies || errorCarnadas || errorTipos;

  // Guardar automáticamente borrador en sessionStorage ante cualquier cambio
  useEffect(() => {
    try {
      const { foto, ...rest } = formData;
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
      if (fotoPreview) {
        sessionStorage.setItem(`${STORAGE_KEY}_preview`, fotoPreview);
      }
    } catch {
      // ignore
    }
  }, [formData, fotoPreview]);

  // Si se proveen coordenadas por Spot
  useEffect(() => {
    if (coordenadasSpot) {
      setFormData((prev) => ({
        ...prev,
        latitud: coordenadasSpot.latitud,
        longitud: coordenadasSpot.longitud,
        ubicacion: nombreSpot || prev.ubicacion,
      }));
      setGpsConfirmado(true);
    }
  }, [coordenadasSpot, nombreSpot]);

  // Si se regresa de la pantalla de mapa completo con coordenadas seleccionadas
  useEffect(() => {
    const coords = location.state?.coordenadas || (location.state?.lat && location.state?.lng ? { lat: location.state.lat, lng: location.state.lng } : null);
    if (coords && !esDesdeSpot) {
      setFormData((prev) => ({
        ...prev,
        latitud: coords.lat,
        longitud: coords.lng,
      }));
      setGpsConfirmado(true);
    }
  }, [location.state, esDesdeSpot]);

  // Si GPS detecta posición inicial
  useEffect(() => {
    if (
      isOpen &&
      position &&
      esUbicacionUsuario &&
      Array.isArray(position) &&
      !formData.latitud &&
      !gpsConfirmado &&
      !gpsRechazado &&
      !esDesdeSpot
    ) {
      const [lat, lng] = position;
      setFormData((prev) => ({
        ...prev,
        latitud: lat,
        longitud: lng,
      }));
    }
  }, [isOpen, position, esUbicacionUsuario, formData.latitud, gpsConfirmado, gpsRechazado, esDesdeSpot]);

  // Filtrado de especies para selector visual
  const especiesFiltradas = useMemo(() => {
    if (!busquedaEspecie.trim()) return especies;
    const term = busquedaEspecie.toLowerCase();
    return especies.filter((e) => {
      const nombreMostrar = obtenerNombreMostrar(e).toLowerCase();
      const cientifico = (e.nombre_cientifico || '').toLowerCase();
      return nombreMostrar.includes(term) || cientifico.includes(term);
    });
  }, [especies, busquedaEspecie]);

  const especieSeleccionadaObj = useMemo(() => {
    return especies.find((e) => e.id === formData.especieId);
  }, [especies, formData.especieId]);

  const handleAceptarGPS = () => {
    if (position && Array.isArray(position)) {
      setFormData((prev) => ({
        ...prev,
        latitud: position[0],
        longitud: position[1],
      }));
    }
    setGpsConfirmado(true);
    setGpsRechazado(false);
  };

  const handleSeleccionarEnMiniMapa = (lat: number, lng: number) => {
    setFormData((prev) => ({
      ...prev,
      latitud: lat,
      longitud: lng,
    }));
    setGpsConfirmado(true);
    setGpsRechazado(false);
  };

  const handleSeleccionarEnMapaCompleto = () => {
    navigate('/mapa', {
      state: {
        modoSeleccion: true,
        volverModal: true,
        returnPath: '/nueva-captura',
      },
    });
  };

  const handleInputChange = (field: keyof NuevaCapturaData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSeleccionarEspecie = (espId: string) => {
    const esp = especies.find((e) => e.id === espId);
    setFormData((prev) => ({
      ...prev,
      especieId: espId,
      especieNombre: esp ? obtenerNombreMostrar(esp) : '',
    }));
  };

  const handleFotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressedFile = await compressImage(file, 1920, 1920, 0.8);
        setFormData((prev) => ({ ...prev, foto: compressedFile }));

        const reader = new FileReader();
        reader.onloadend = () => {
          setFotoPreview(reader.result as string);
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error('Error al procesar foto:', error);
        alert('Error al comprimir la imagen. Intenta con otra foto.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.especieId) {
      alert('Por favor selecciona una especie');
      return;
    }

    if (!formData.carnada || !formData.tipoPesca) {
      alert('Por favor completa la carnada y la modalidad de pesca');
      return;
    }

    if (!formData.latitud || !formData.longitud) {
      alert('Por favor indica la ubicación de la captura en el mapa o mediante GPS');
      return;
    }

    try {
      setGuardandoForm(true);
      await onSave(formData);
      limpiarBorrador();
      onClose();
    } catch (err: any) {
      console.error(err);
      alert('Error al guardar la captura.');
    } finally {
      setGuardandoForm(false);
    }
  };

  const limpiarBorrador = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(`${STORAGE_KEY}_preview`);
    setFormData({
      especieId: '',
      especieNombre: '',
      fecha: new Date().toISOString().split('T')[0],
      ubicacion: '',
      carnada: '',
      tipoPesca: '',
      horaCaptura: new Date().toTimeString().slice(0, 5),
    });
    setFotoPreview('');
    setGpsConfirmado(false);
    setGpsRechazado(false);
  };

  const handleClose = () => {
    limpiarBorrador();
    onClose();
  };

  if (!isOpen) return null;

  // Centro del mapa por defecto (Argentina / ubicación actual)
  const mapCenter: [number, number] =
    formData.latitud && formData.longitud
      ? [formData.latitud, formData.longitud]
      : position && Array.isArray(position)
      ? [position[0], position[1]]
      : [-35.75, -58.5];

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-50 p-3 sm:p-4 overflow-y-auto">
      <div
        className={`bg-card w-full rounded-3xl border border-border/60 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col ${
          isMobile ? 'max-w-full' : 'max-w-2xl'
        }`}
      >
        {/* Cabecera Modal */}
        <div className="px-5 py-4 border-b border-border/40 flex items-center justify-between bg-muted/20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-sm">
              <Fish className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-foreground text-base sm:text-lg tracking-tight">
                Registrar Captura
              </h2>
              <p className="text-[11px] text-muted-foreground font-medium">
                {esDesdeSpot && nombreSpot ? `Spot: ${nombreSpot}` : 'Bitácora deportiva de pesca'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            type="button"
            className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo del Formulario */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
          {hasErrors && (
            <div className="p-3.5 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0" />
              <span>Error cargando opciones: {errorEspecies || errorCarnadas || errorTipos}</span>
            </div>
          )}

          {/* 1. SELECCIÓN VISUAL DE ESPECIE */}
          <div className="space-y-2.5 bg-muted/20 p-4 rounded-2xl border border-border/40">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Fish className="w-4 h-4 text-primary" />
                <span>Especie Capturada *</span>
              </label>
              {formData.especieId && (
                <span className="text-[10px] text-primary font-bold flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                  <Check className="w-3 h-3" /> {formData.especieNombre}
                </span>
              )}
            </div>

            {/* Buscador de Especie */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={busquedaEspecie}
                onChange={(e) => setBusquedaEspecie(e.target.value)}
                placeholder="Buscar especie por nombre (ej: Pejerrey, Dorado, Bacota)..."
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-background border border-border/60 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              {busquedaEspecie && (
                <button
                  type="button"
                  onClick={() => setBusquedaEspecie('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Cuadrícula / Selector de Especies */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto p-1 pr-1.5 custom-scrollbar">
              {especiesFiltradas.slice(0, 12).map((esp) => {
                const isSelected = formData.especieId === esp.id;
                const nombre = obtenerNombreMostrar(esp);
                return (
                  <button
                    key={esp.id}
                    type="button"
                    onClick={() => handleSeleccionarEspecie(esp.id)}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-primary/10 border-primary text-primary font-bold shadow-sm ring-1 ring-primary/30'
                        : 'bg-background hover:bg-muted border-border/40 text-foreground text-xs'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-muted/60 flex items-center justify-center shrink-0 overflow-hidden border border-border/30">
                      {esp.imagen ? (
                        <img src={esp.imagen} alt={nombre} className="w-full h-full object-contain p-0.5" />
                      ) : (
                        <Fish className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    <span className="text-[11px] truncate leading-tight">{nombre}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. FOTO DE LA CAPTURA */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-primary" />
              <span>Foto de la Captura (Opcional)</span>
            </label>

            {fotoPreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-border/60 bg-muted/20 max-h-52 flex justify-center items-center group">
                <img src={fotoPreview} alt="Foto Captura" className="max-h-52 w-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setFotoPreview('');
                    setFormData((prev) => ({ ...prev, foto: undefined }));
                  }}
                  className="absolute top-3 right-3 p-2 bg-destructive/90 hover:bg-destructive text-white rounded-full shadow-lg transition-transform active:scale-95"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-border/60 hover:border-primary/60 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer bg-muted/10 hover:bg-primary/5 transition-all group">
                <div className="p-3 rounded-full bg-primary/10 text-primary mb-2 group-hover:scale-110 transition-transform">
                  <Upload className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-foreground">Hacé clic para subir tu foto</span>
                <span className="text-[10px] text-muted-foreground mt-0.5">JPG, PNG o WebP (se optimiza automáticamente)</span>
                <input type="file" accept="image/*" onChange={handleFotoChange} className="hidden" />
              </label>
            )}
          </div>

          {/* 3. MODALIDAD Y CARNADA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-primary" />
                <span>Modalidad de Pesca *</span>
              </label>
              <select
                value={formData.tipoPesca}
                onChange={(e) => handleInputChange('tipoPesca', e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl bg-muted/40 border border-border/60 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="">Seleccionar modalidad...</option>
                {tiposPesca.map((t) => (
                  <option key={t.id} value={t.nombre}>
                    {t.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                <span>Carnada / Señuelo *</span>
              </label>
              <select
                value={formData.carnada}
                onChange={(e) => handleInputChange('carnada', e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl bg-muted/40 border border-border/60 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="">Seleccionar carnada...</option>
                {carnadas.map((c) => (
                  <option key={c.idCarnada} value={c.nombre}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4. MEDIDAS Y FECHA */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center gap-1">
                <Weight className="w-3.5 h-3.5 text-amber-500" />
                <span>Peso (kg)</span>
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={formData.peso || ''}
                onChange={(e) => handleInputChange('peso', parseFloat(e.target.value) || undefined)}
                placeholder="Ej: 3.5"
                className="w-full px-3 py-2 rounded-xl bg-muted/40 border border-border/60 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center gap-1">
                <Ruler className="w-3.5 h-3.5 text-blue-500" />
                <span>Largo (cm)</span>
              </label>
              <input
                type="number"
                step="1"
                min="0"
                value={formData.tamanio || ''}
                onChange={(e) => handleInputChange('tamanio', parseInt(e.target.value, 10) || undefined)}
                placeholder="Ej: 48"
                className="w-full px-3 py-2 rounded-xl bg-muted/40 border border-border/60 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                <span>Fecha</span>
              </label>
              <input
                type="date"
                value={formData.fecha}
                onChange={(e) => handleInputChange('fecha', e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl bg-muted/40 border border-border/60 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-purple-500" />
                <span>Hora</span>
              </label>
              <input
                type="time"
                value={formData.horaCaptura || ''}
                onChange={(e) => handleInputChange('horaCaptura', e.target.value)}
                className="w-full px-2.5 py-2 rounded-xl bg-muted/40 border border-border/60 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          {/* 5. UBICACIÓN INTERACTIVA */}
          <div className="space-y-2.5 bg-muted/20 p-4 rounded-2xl border border-border/40">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-500" />
                <span>Lugar y Coordenadas *</span>
              </label>

              {formData.latitud && formData.longitud && (
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <Check className="w-3 h-3" /> {formData.latitud.toFixed(4)}, {formData.longitud.toFixed(4)}
                </span>
              )}
            </div>

            {/* Acciones de Ubicación */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleAceptarGPS}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all active:scale-95"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Usar mi GPS actual</span>
              </button>

              <button
                type="button"
                onClick={() => setMostrarMiniMapa(!mostrarMiniMapa)}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-muted/60 hover:bg-muted text-foreground border border-border/60 text-xs font-bold transition-all active:scale-95"
              >
                <Layers className="w-3.5 h-3.5 text-primary" />
                <span>{mostrarMiniMapa ? 'Ocultar Mapa' : 'Marcar en Mapa'}</span>
              </button>
            </div>

            {/* Mini Mapa embebido */}
            {mostrarMiniMapa && (
              <div className="space-y-2 pt-2 animate-in fade-in duration-200">
                <div className="h-44 rounded-2xl overflow-hidden border border-border/60 relative shadow-inner">
                  <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <MiniMapClickHandler onSelect={handleSeleccionarEnMiniMapa} />
                    {formData.latitud && formData.longitud && (
                      <Marker position={[formData.latitud, formData.longitud]} icon={markerIcon} />
                    )}
                  </MapContainer>
                  <div className="absolute top-2 left-2 z-[400] bg-background/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] font-bold text-foreground border border-border/40 shadow-sm pointer-events-none">
                    Tocá cualquier punto para clavar el pin 📍
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSeleccionarEnMapaCompleto}
                  className="w-full text-[11px] text-primary hover:underline font-semibold text-center block pt-1"
                >
                  ¿Querés ver el mapa en pantalla completa? Hacé clic acá →
                </button>
              </div>
            )}

            <input
              type="text"
              value={formData.ubicacion}
              onChange={(e) => handleInputChange('ubicacion', e.target.value)}
              placeholder="Referencia escrita (ej: Río Salado, Muelle Claromecó, Faro Querandí)..."
              className="w-full px-3 py-2 rounded-xl bg-background border border-border/60 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          {/* 6. CLIMA (CHIPS) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-foreground block">Clima del Día</label>
            <div className="flex flex-wrap gap-2">
              {climas.map((c) => {
                const isSelected = formData.clima === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleInputChange('clima', isSelected ? '' : c.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/30'
                        : 'bg-muted/40 hover:bg-muted border-border/40 text-muted-foreground'
                    }`}
                  >
                    <span>{c.icon}</span>
                    <span>{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 7. NOTAS */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground block">Notas / Experiencia del pique</label>
            <textarea
              rows={2}
              value={formData.notas || ''}
              onChange={(e) => handleInputChange('notas', e.target.value)}
              placeholder="Detalles de la pelea, estado del agua, boyas usadas, profundidad..."
              className="w-full px-3.5 py-2 rounded-xl bg-muted/40 border border-border/60 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none leading-relaxed"
            />
          </div>

          {/* BOTONES */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/40 shrink-0">
            <button
              type="button"
              disabled={guardandoForm}
              onClick={handleClose}
              className="px-4 py-2.5 rounded-xl font-bold text-xs text-muted-foreground hover:bg-muted transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardandoForm || isLoadingData}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {guardandoForm ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Guardar Captura
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioCaptura;
