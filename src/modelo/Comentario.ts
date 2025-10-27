import type { Usuario } from "./Usuario";

export interface Comentario {
  id: string;
  idUsuario: string;
  idSpot: string;
  idComentarioPadre?: string;
  contenido: string;
  fecha: string;
  usuario: Usuario;
  respuestas?: Comentario[];
}