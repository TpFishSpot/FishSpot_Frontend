export interface Spot {
  id: string
  nombre: string
  estado: "Esperando" | "Aceptado" | "Rechazado" | "Inactivo"
  descripcion: string
  ubicacion: {
    type: "Point"
    coordinates: [number, number] 
  }
  fechaPublicacion: string
  fechaActualizacion: string
  idUsuario: string
  idUsuarioActualizo: string
}
