import React, { useState, useEffect } from 'react';
import { FishOff, Fish } from 'lucide-react';
import apiFishSpot from '../api/apiFishSpot';

interface Especie {
  id: string;
  nombre_cientifico: string;
  nombre_comun: string[];
  descripcion?: string;
  imagen?: string;
}

interface Carnada {
  idCarnada: string;
  nombre: string;
  tipo: string;
  descripcion?: string;
}

interface TipoPesca {
  id: string;
  nombre: string;
  descripcion?: string;
}

interface SeleccionCarnadaTipoPescaProps {
  especiesSeleccionadas: Especie[];
  carnadasSeleccionadas: Carnada[];
  tiposPescaSeleccionados: TipoPesca[];
  onCarnadaChange: (carnadas: Carnada[]) => void;
  onTipoPescaChange: (tipos: TipoPesca[]) => void;
}

export function SeleccionCarnadaTipoPesca({
  especiesSeleccionadas,
  carnadasSeleccionadas,
  tiposPescaSeleccionados,
  onCarnadaChange,
  onTipoPescaChange,
}: SeleccionCarnadaTipoPescaProps) {
  const [carnadasDisponibles, setCarnadasDisponibles] = useState<Carnada[]>([]);
  const [tiposPescaDisponibles, setTiposPescaDisponibles] = useState<TipoPesca[]>([]);
  const [cargandoCarnadas, setCargandoCarnadas] = useState(false);
  const [cargandoTipos, setCargandoTipos] = useState(false);

  useEffect(() => {
    if (especiesSeleccionadas.length === 0) {
      setCarnadasDisponibles([]);
      setTiposPescaDisponibles([]);
      return;
    }

    const cargarDatos = async () => {
      // Cargar carnadas
      setCargandoCarnadas(true);
      try {
        const carnadasPromesas = especiesSeleccionadas.map(esp =>
          apiFishSpot.get<Carnada[]>(`/especie/${esp.id}/carnadas`)
        );
        const respuestasCarnadas = await Promise.all(carnadasPromesas);
        
        const todasCarnadas = respuestasCarnadas.flatMap(resp => resp.data);
        const carnadasUnicas = Array.from(
          new Map(todasCarnadas.map(c => [c.idCarnada, c])).values()
        );
        
        setCarnadasDisponibles(carnadasUnicas);
      } catch (error) {
        console.error("Error cargando carnadas:", error);
        setCarnadasDisponibles([]);
      } finally {
        setCargandoCarnadas(false);
      }

      // Cargar tipos de pesca
      setCargandoTipos(true);
      try {
        const tiposPromesas = especiesSeleccionadas.map(esp =>
          apiFishSpot.get<TipoPesca[]>(`/especie/${esp.id}/tipoPesca`)
        );
        const respuestasTipos = await Promise.all(tiposPromesas);
        
        const todosTipos = respuestasTipos.flatMap(resp => resp.data);
        const tiposUnicos = Array.from(
          new Map(todosTipos.map(t => [t.id, t])).values()
        );
        
        setTiposPescaDisponibles(tiposUnicos);
      } catch (error) {
        console.error("Error cargando tipos de pesca:", error);
        setTiposPescaDisponibles([]);
      } finally {
        setCargandoTipos(false);
      }
    };

    cargarDatos();
  }, [especiesSeleccionadas]);

  const toggleCarnada = (carnada: Carnada) => {
    const yaSeleccionada = carnadasSeleccionadas.find(c => c.idCarnada === carnada.idCarnada);
    if (yaSeleccionada) {
      onCarnadaChange(carnadasSeleccionadas.filter(c => c.idCarnada !== carnada.idCarnada));
    } else {
      onCarnadaChange([...carnadasSeleccionadas, carnada]);
    }
  };

  const toggleTipoPesca = (tipo: TipoPesca) => {
    const yaSeleccionado = tiposPescaSeleccionados.find(t => t.id === tipo.id);
    if (yaSeleccionado) {
      onTipoPescaChange(tiposPescaSeleccionados.filter(t => t.id !== tipo.id));
    } else {
      onTipoPescaChange([...tiposPescaSeleccionados, tipo]);
    }
  };

  if (especiesSeleccionadas.length === 0) {
    return (
      <div className="space-y-4 p-4 bg-muted/30 rounded-lg border-2 border-dashed border-muted text-center">
        <p className="text-muted-foreground text-sm">
          Selecciona primero las especies para ver carnadas y tipos de pesca recomendados
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Carnadas */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <FishOff className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-card-foreground">Carnadas recomendadas</h3>
          {cargandoCarnadas && (
            <div className="animate-pulse text-muted-foreground text-sm">Cargando...</div>
          )}
        </div>

        {carnadasSeleccionadas.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {carnadasSeleccionadas.map(carnada => (
              <span
                key={carnada.idCarnada}
                className="inline-flex items-center gap-1 px-2 py-1 bg-primary text-primary-foreground rounded-full text-xs"
              >
                {carnada.nombre}
                <button
                  type="button"
                  onClick={() => toggleCarnada(carnada)}
                  className="hover:bg-primary/80 rounded-full p-0.5"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto border border-border rounded-lg p-2 bg-card">
          {carnadasDisponibles.length > 0 ? (
            carnadasDisponibles.map(carnada => {
              const seleccionada = carnadasSeleccionadas.some(c => c.idCarnada === carnada.idCarnada);
              return (
                <button
                  key={carnada.idCarnada}
                  type="button"
                  onClick={() => toggleCarnada(carnada)}
                  disabled={seleccionada}
                  className={`px-2 py-1 rounded-lg text-xs border transition-colors text-left ${
                    seleccionada
                      ? "bg-muted text-muted-foreground border-muted cursor-not-allowed"
                      : "bg-card text-card-foreground border-border hover:bg-primary/10 hover:border-primary"
                  }`}
                >
                  <div className="font-medium truncate">{carnada.nombre}</div>
                  <div className="text-xs text-muted-foreground capitalize">
                    {carnada.tipo.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                </button>
              );
            })
          ) : (
            <div className="col-span-full space-y-3">
              <div className="text-center text-muted-foreground text-sm p-4">
                {cargandoCarnadas ? "Cargando carnadas..." : "No se encontraron carnadas recomendadas para las especies seleccionadas"}
              </div>
              {!cargandoCarnadas && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      alert("Funcionalidad para agregar nueva carnada - Próximamente");
                    }}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
                  >
                    + Agregar nueva carnada
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Botón adicional para agregar carnada incluso si ya hay carnadas */}
        {carnadasDisponibles.length > 0 && !cargandoCarnadas && (
          <div className="text-center mt-2">
            <button
              type="button"
              onClick={() => {
                alert("Funcionalidad para agregar nueva carnada - Próximamente");
              }}
              className="px-3 py-1 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors text-sm"
            >
              + Agregar otra carnada
            </button>
          </div>
        )}
      </div>

      {/* Tipos de Pesca */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Fish className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-card-foreground">Tipos de pesca recomendados</h3>
          {cargandoTipos && (
            <div className="animate-pulse text-muted-foreground text-sm">Cargando...</div>
          )}
        </div>

        {tiposPescaSeleccionados.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {tiposPescaSeleccionados.map(tipo => (
              <span
                key={tipo.id}
                className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs"
              >
                {tipo.nombre}
                <button
                  type="button"
                  onClick={() => toggleTipoPesca(tipo)}
                  className="hover:bg-secondary/80 rounded-full p-0.5"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-border rounded-lg p-2 bg-card">
          {tiposPescaDisponibles.length > 0 ? (
            tiposPescaDisponibles.map(tipo => {
              const seleccionado = tiposPescaSeleccionados.some(t => t.id === tipo.id);
              return (
                <button
                  key={tipo.id}
                  type="button"
                  onClick={() => toggleTipoPesca(tipo)}
                  disabled={seleccionado}
                  className={`px-3 py-2 rounded-lg text-sm border transition-colors text-left ${
                    seleccionado
                      ? "bg-muted text-muted-foreground border-muted cursor-not-allowed"
                      : "bg-card text-card-foreground border-border hover:bg-secondary/10 hover:border-secondary"
                  }`}
                >
                  <div className="font-medium">{tipo.nombre}</div>
                  {tipo.descripcion && (
                    <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {tipo.descripcion}
                    </div>
                  )}
                </button>
              );
            })
          ) : (
            <div className="col-span-full space-y-3">
              <div className="text-center text-muted-foreground text-sm p-4">
                {cargandoTipos ? "Cargando tipos de pesca..." : "No se encontraron tipos de pesca recomendados para las especies seleccionadas"}
              </div>
              {!cargandoTipos && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      alert("Funcionalidad para agregar nuevo tipo de pesca - Próximamente");
                    }}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
                  >
                    + Agregar nuevo tipo de pesca
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Botón adicional para agregar tipo de pesca incluso si ya hay tipos */}
        {tiposPescaDisponibles.length > 0 && !cargandoTipos && (
          <div className="text-center mt-2">
            <button
              type="button"
              onClick={() => {
                alert("Funcionalidad para agregar nuevo tipo de pesca - Próximamente");
              }}
              className="px-3 py-1 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors text-sm"
            >
              + Agregar otro tipo de pesca
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
