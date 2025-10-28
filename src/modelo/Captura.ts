export interface Captura {
  id?: string
  idUsuario: string
  especieId: string
  fecha: string
  ubicacion: string
  spotId?: string
  latitud?: number
  longitud?: number
  peso?: number
  tamanio?: number
  carnada: string
  tipoPesca: string
  foto?: string
  notas?: string
  clima?: string
  horaCaptura?: string
  fechaCreacion?: string
  especie?: {
    id: string
    nombreCientifico: string
    descripcion: string
    imagen: string
    nombresComunes?: any[]
  }
  spot?: {
    id: string
    nombre: string
    ubicacion: {
      type: string
      coordinates: [number, number]
    }
  }
}

export interface NuevaCapturaData {
  especieId: string
  fecha: string
  ubicacion: string
  spotId?: string
  latitud?: number
  longitud?: number
  peso?: number
  tamanio?: number
  carnada: string
  tipoPesca: string
  foto?: File
  notas?: string
  clima?: string
  horaCaptura?: string
}

export interface EstadisticasCapturas {
  totalCapturas: number
  especiesCapturadas: number
  capturasPorMes: Record<string, number>
}
