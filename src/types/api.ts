export interface Especie {
  idEspecie: string;
  nombreCientifico: string;
  descripcion: string;
  imagen?: string;
  nombresComunes?: NombreComun[];
}

export interface NombreComun {
  idNombreEspecie: string;
  nombre: string;
}

export interface TipoPesca {
  id: string;
  nombre: string;
  descripcion: string;
}

export interface Spot {
  id: string;
  nombre: string;
  estado: string;
  descripcion: string;
  ubicacion: string;
  fechaPublicacion: string;
  fechaActualizacion: string;
  idUsuario: string;
  idUsuarioActualizo?: string;
  imagenPortada?: string;
  isDeleted: boolean;
}

export interface Captura {
  id: string;
  idUsuario: string;
  especieId: string;
  fecha: string;
  ubicacion: string;
  peso?: number;
  longitud?: number;
  carnada: string;
  tipoPesca: string;
  foto?: string;
  notas?: string;
  clima?: string;
  horaCaptura?: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  especie?: Especie;
}

export interface Usuario {
  uid: string;
  nombre: string;
  email: string;
  roles?: string[];
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}