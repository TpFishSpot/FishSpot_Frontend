import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import type { EspecieConNombreComun } from "../../modelo/EspecieConNombreComun";
import { baseApi } from "../../api/apiFishSpot";

interface Props {
  todasEspecies: EspecieConNombreComun[];
  especiesSeleccionadas: EspecieConNombreComun[];
  addEspecie: (esp: EspecieConNombreComun) => void;
  removeEspecie: (id: string) => void;
}

export default function ListaEspeciesSeleccion({ todasEspecies, especiesSeleccionadas, addEspecie, removeEspecie }: Props) {
  const [busqueda, setBusqueda] = useState("");

  const obtenerNombrePrincipal = (esp: EspecieConNombreComun) => {
    if (esp.nombre_comun && esp.nombre_comun.length > 0) {
      return esp.nombre_comun[0];
    }
    return esp.nombre_cientifico;
  };

  const especiesFiltradas = useMemo(() => {
    if (!busqueda.trim()) return todasEspecies;

    const terminoBusqueda = busqueda.toLowerCase().trim();

    return todasEspecies.filter(esp => {
      const coincideEnNombreComun = esp.nombre_comun.some(nombre =>
        nombre.toLowerCase().includes(terminoBusqueda)
      );

      const coincideEnNombreCientifico = esp.nombre_cientifico.toLowerCase().includes(terminoBusqueda);

      return coincideEnNombreComun || coincideEnNombreCientifico;
    });
  }, [todasEspecies, busqueda]);

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar especies por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full pl-10 pr-10 py-2 border border-border rounded-lg bg-card text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        {busqueda && (
          <button
            type="button"
            onClick={() => setBusqueda("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {especiesSeleccionadas.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-card-foreground">Especies seleccionadas ({especiesSeleccionadas.length}):</h4>
          <div className="flex flex-wrap gap-2">
            {especiesSeleccionadas.map((esp) => (
              <span
                key={esp.id}
                className="inline-flex items-center gap-2 px-2 py-1 bg-primary text-primary-foreground rounded-full text-xs"
              >
                <div className="w-5 h-5 rounded-full overflow-hidden border border-primary-foreground/20 bg-primary-foreground/10 flex items-center justify-center flex-shrink-0">
                  {esp.imagen ? (
                    <img
                      src={`${baseApi}/${esp.imagen}`}
                      alt={obtenerNombrePrincipal(esp)}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`text-xs ${esp.imagen ? 'hidden' : ''}`}></div>
                </div>

                <span className="truncate max-w-24">{obtenerNombrePrincipal(esp)}</span>

                <button
                  type="button"
                  onClick={() => removeEspecie(esp.id)}
                  className="hover:bg-primary/80 rounded-full p-0.5 flex-shrink-0"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="max-h-60 overflow-y-auto border border-border rounded-lg bg-card">
        {especiesFiltradas.length > 0 ? (
          <div className="grid grid-cols-1 gap-1 p-2">
            {especiesFiltradas.map((esp) => {
              const seleccionado = especiesSeleccionadas.some(e => e.id === esp.id);
              const nombrePrincipal = obtenerNombrePrincipal(esp);
              const nombresSecundarios = esp.nombre_comun.slice(1);

              return (
                <button
                  key={esp.id}
                  type="button"
                  onClick={() => addEspecie(esp)}
                  disabled={seleccionado}
                  className={`px-3 py-2 rounded-lg text-left border transition-colors flex items-center gap-3 ${
                    seleccionado
                      ? "bg-muted text-muted-foreground border-muted cursor-not-allowed"
                      : "bg-card text-card-foreground border-border hover:bg-primary/10 hover:border-primary"
                  }`}
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-border bg-muted flex items-center justify-center">
                      {esp.imagen ? (
                        <img
                          src={`${baseApi}/${esp.imagen}`}
                          alt={nombrePrincipal}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}

                      <div className={`text-muted-foreground text-xs font-bold ${esp.imagen ? 'hidden' : ''}`}>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{nombrePrincipal}</div>
                    {nombresSecundarios.length > 0 && (
                      <div className="text-xs text-muted-foreground mt-0.5 truncate">
                        {nombresSecundarios.join(", ")}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground italic mt-0.5 truncate">
                      {esp.nombre_cientifico}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="p-4 text-center text-muted-foreground text-sm">
            No se encontraron especies que coincidan con "{busqueda}"
          </div>
        )}
      </div>
    </div>
  );
}