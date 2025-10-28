export interface TipoPesca {
  id: string
  nombre: string
  descripcion: string
  equipamiento?: string
  ambiente?: string
}

export interface SpotTipoPesca {
  id: string
  idSpot: string
  idTipoPesca: string
  tipoPesca: TipoPesca
}
