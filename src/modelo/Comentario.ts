import type { Usuario } from "./Usuario";

export interface Comentario {
  id: string;
  idUsuario: string;
  idSpot: string;
  contenido: string;
  fecha: string;
  usuario: Usuario;
}