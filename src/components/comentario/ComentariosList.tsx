import type React from "react";
import ComentarioItem from "./ComentarioItem";
import ComentarioForm from "./ComentarioForm";
import type { Comentario } from "../../modelo/Comentario";

interface Props {
  comentarios: Comentario[];
  loading: boolean;
  error: string;
  nuevoComentario: string;
  setNuevoComentario: (value: string) => void;
  enviarComentario: (e: React.FormEvent) => void;
}

export default function ComentariosList({
  comentarios,
  loading,
  error,
  nuevoComentario,
  setNuevoComentario,
  enviarComentario
}: Props) {
  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-6">
      <h2 className="text-2xl font-bold text-card-foreground mb-6 flex items-center gap-2">
        <span className="text-yellow-500">💬</span>
        Comentarios
      </h2>

      <ComentarioForm
        nuevoComentario={nuevoComentario}
        setNuevoComentario={setNuevoComentario}
        enviarComentario={enviarComentario}
      />

      {loading ? (
        <p>Cargando comentarios...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : comentarios.length === 0 ? (
        <p className="text-muted-foreground italic">No hay comentarios aún.</p>
      ) : (
        <div className="space-y-4">
          {comentarios.map((c) => (
            <ComentarioItem key={c.id} comentario={c} />
          ))}
        </div>
      )}
    </div>
  );
}
