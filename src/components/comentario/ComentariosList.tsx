import { useEffect, useRef, useState } from "react";
import { ComentarioItem } from "./ComentarioItem";
import ComentarioForm from "./ComentarioForm";
import apiFishSpot from "../../api/apiFishSpot";
import type { Comentario } from "../../modelo/Comentario";
import { useAuth } from "../../contexts/AuthContext";

interface Props {
  idSpot: string;
}

export const ComentariosList = ({ idSpot }: Props) => {
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [lastFecha, setLastFecha] = useState<string | null>(null);
  const [lastId, setLastId] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string>("");
  const token = localStorage.getItem("token");
  const cargadoRef = useRef(false);
  const [hayMas, setHayMas] = useState(true);
  const [mensajeFinal, setMensajeFinal] = useState("");
  const { user } = useAuth();


  const cargarComentarios = async (reset = false) => {
    if (cargando) return;
    setCargando(true);
    setError("");

    try {
      const query =
        !reset && lastFecha
          ? `?lastFecha=${encodeURIComponent(lastFecha)}&lastId=${lastId}`
          : "";

      const { data } = await apiFishSpot.get<Comentario[]>(
        `/comentario/${idSpot}${query}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.length > 0) {
        const nuevosComentarios = data;
        setComentarios((prev) =>
          reset ? nuevosComentarios : [...prev, ...nuevosComentarios]
        );

        const ultimo = nuevosComentarios[nuevosComentarios.length - 1];
        setLastFecha(ultimo.fecha);
        setLastId(ultimo.id);
        setHayMas(true);
        setMensajeFinal("");
      } else {
        if (reset) {
          setComentarios([]);
          setLastFecha(null);
          setLastId(null);
          setHayMas(false);
          setMensajeFinal("");
        } else {
          setHayMas(false);
          setMensajeFinal("Ya se han mostrado todos los comentarios.");
        }
      }
    } catch (err: any) {
      console.error(err);
      setError("No se pudieron cargar los comentarios.");
    } finally {
      setCargando(false);
    }
  };

  const enviarComentario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoComentario.trim()) return;

    try {
      const { data } = await apiFishSpot.post<Comentario>(
        "/comentario",
        { idSpot, contenido: nuevoComentario },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNuevoComentario("");
      setComentarios(prev => [data, ...prev]);
      await cargarComentarios(true);
    } catch (err: any) {
      console.error(err);
      setError("No se pudo publicar el comentario.");
    }
  };

  const handleResponder = async (idComentarioPadre: string, contenido: string) => {
    try {
      const { data } = await apiFishSpot.post<Comentario>(
        "/comentario/responder",
        { idSpot, idComentarioPadre, contenido },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComentarios(prev =>
        prev.map(c =>
          c.id === idComentarioPadre
            ? { ...c, respuestas: [...(c.respuestas || []), data] }
            : c
        )
      );
      await cargarComentarios(true);
    } catch (err: any) {
      console.error(err);
      setError("No se pudo enviar la respuesta.");
    }
  };

  useEffect(() => {
    if (cargadoRef.current) return;
    cargadoRef.current = true;

    setComentarios([]);
    setLastFecha(null);
    cargarComentarios(true);
  }, [idSpot]);

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-6 space-y-4">
      {user && (
        <ComentarioForm
          nuevoComentario={nuevoComentario}
          setNuevoComentario={setNuevoComentario}
          enviarComentario={enviarComentario}
        />
      )}

      {comentarios.length === 0 && !cargando && (
        <p className="text-sm text-muted-foreground text-center">No hay comentarios todavía.</p>
      )}

      {comentarios.map(c => (
        <ComentarioItem key={c.id} comentario={c} onResponder={handleResponder} />
      ))}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {hayMas ? (
        <div className="text-center mt-4">
          <button
            onClick={() => cargarComentarios()}
            disabled={cargando}
            className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg shadow hover:bg-primary/90 transition-colors duration-200"
          >
            {cargando ? "Cargando..." : "Cargar más"}
          </button>
        </div>
      ) : (
        <p className="text-center mt-4 text-muted-foreground italic">{mensajeFinal}</p>
      )}
    </div>
  );
};
