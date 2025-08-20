export interface NombreEspecie {
  id: string;
  nombre: string;
}

export interface Especie {
  idEspecie: string;
  nombreCientifico: string;
  descripcion: string;
  imagen?: string;
  nombresComunes: NombreEspecie[];
}
