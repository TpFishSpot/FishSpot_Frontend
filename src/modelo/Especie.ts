export interface NombreEspecie {
  id: string;
  nombre: string;
}

export interface Especie {
  id: string;
  idEspecie: string;
  nombreCientifico: string;
  descripcion: string;
  imagen?: string;
  nombresComunes: NombreEspecie[];
  carnadas?: string[];
  tiposPesca?: string[];
  spots?: string[];
}
