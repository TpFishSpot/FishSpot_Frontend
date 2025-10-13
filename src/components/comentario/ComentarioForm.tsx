import type React from "react";

interface Props {
  nuevoComentario: string;
  setNuevoComentario: (value: string) => void;
  enviarComentario: (e: React.FormEvent) => void;
}

export default function ComentarioForm({ nuevoComentario, setNuevoComentario, enviarComentario }: Props) {
  return (
    <form onSubmit={enviarComentario} className="space-y-4 mb-6">
      <textarea
        value={nuevoComentario}
        onChange={(e) => setNuevoComentario(e.target.value)}
        placeholder="Escribe tu comentario..."
        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition-all duration-200 bg-card text-card-foreground"
        rows={3}
      />
      <button
        type="submit"
        disabled={!nuevoComentario.trim()}
        className="bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        Publicar comentario
      </button>
    </form>
  );
}
