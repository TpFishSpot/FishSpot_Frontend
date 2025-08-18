import type { Key } from "react"

export interface EspecieConNombreComun {
  id: Key | null | undefined
  nombre_cientifico: string
  descripcion: string
  nombre_comun: string[]
  imagen: string
}
