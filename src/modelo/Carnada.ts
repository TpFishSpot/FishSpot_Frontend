export type TipoCarnada =
  | 'ArtificialBlando'
  | 'ArtificialDuro'
  | 'CarnadaViva'
  | 'CarnadaMuerta'
  | 'NaturalNoViva'
  | 'MoscaArtificial'
  | 'Otros';

export interface Carnada {
  idCarnada: string;
  nombre: string;
  tipo: TipoCarnada;
  descripcion?: string;
}
