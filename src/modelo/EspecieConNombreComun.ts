export interface EspecieConNombreComun {
  id: string
  nombre_cientifico: string
  descripcion: string
  nombresComunes: { id: string; nombre: string }[]
  imagen?: string
}
