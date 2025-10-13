import type { Comentario } from "../../modelo/Comentario";

interface Props {
  comentario: Comentario;
}

export default function ComentarioItem({ comentario }: Props) {
  return (
    <div className="border-b border-border pb-2">
      <p className="text-sm text-muted-foreground">
        {comentario.usuario.nombre} • {new Date(comentario.fecha).toLocaleDateString('es-AR', { timeZone: 'UTC' })}
      </p>
      <p className="text-foreground">{comentario.contenido}</p>
    </div>
  );
}
