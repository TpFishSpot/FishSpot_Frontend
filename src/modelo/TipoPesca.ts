export interface TipoPesca {
  id: string
  nombre: string
  descripcion: string
}

export interface SpotTipoPesca {
  id: string
  idSpot: string
  idTipoPesca: string
  tipoPesca: TipoPesca
}
