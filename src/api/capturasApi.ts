import apiFishSpot from './apiFishSpot'

export interface Captura {
  id?: string
  idUsuario: string
  especieId: string
  fecha: string
  ubicacion: string
  peso?: number
  longitud?: number
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
}

export interface NuevaCapturaData {
  especieId: string
  fecha: string
  ubicacion: string
  peso?: number
  longitud?: number
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
  pesoTotal: number
  mayorCaptura?: Captura
  capturasPorMes: number
  especieFavorita: string
}

export const obtenerCapturas = async (usuarioId?: string): Promise<Captura[]> => {
  try {
    const url = usuarioId ? `/capturas/usuario/${usuarioId}` : '/capturas/mis-capturas'
    const response = await apiFishSpot.get(url)
    return response.data
  } catch (error) {
    console.error('Error obteniendo capturas:', error)
    throw error
  }
}

export const crearCaptura = async (captura: NuevaCapturaData): Promise<Captura> => {
  try {
    const formData = new FormData()

    formData.append('especieId', captura.especieId)
    formData.append('fecha', captura.fecha)
    formData.append('ubicacion', captura.ubicacion)
    formData.append('carnada', captura.carnada)
    formData.append('tipoPesca', captura.tipoPesca)

    if (captura.peso) formData.append('peso', captura.peso.toString())
    if (captura.longitud) formData.append('longitud', captura.longitud.toString())
    if (captura.notas) formData.append('notas', captura.notas)
    if (captura.clima) formData.append('clima', captura.clima)
    if (captura.horaCaptura) formData.append('horaCaptura', captura.horaCaptura)

    if (captura.foto) {
      formData.append('foto', captura.foto)
    }

    const response = await apiFishSpot.post('/capturas', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    
    return response.data
  } catch (error) {
    console.error('Error creando captura:', error)
    throw error
  }
}

export const actualizarCaptura = async (id: string, captura: Partial<NuevaCapturaData>): Promise<Captura> => {
  try {
    const formData = new FormData()

    Object.entries(captura).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'foto' && value instanceof File) {
          formData.append('foto', value)
        } else if (typeof value === 'number') {
          formData.append(key, value.toString())
        } else if (typeof value === 'string') {
          formData.append(key, value)
        }
      }
    })

    const response = await apiFishSpot.put(`/capturas/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    
    return response.data
  } catch (error) {
    console.error('Error actualizando captura:', error)
    throw error
  }
}

export const eliminarCaptura = async (id: string): Promise<void> => {
  try {
    await apiFishSpot.delete(`/capturas/${id}`)
  } catch (error) {
    console.error('Error eliminando captura:', error)
    throw error
  }
}

export const obtenerEstadisticas = async (usuarioId?: string): Promise<EstadisticasCapturas> => {
  try {
    const url = usuarioId ? `/capturas/estadisticas/${usuarioId}` : '/capturas/mis-estadisticas'
    const response = await apiFishSpot.get(url)
    return response.data
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error)
    throw error
  }
}

export const subirFotoCaptura = async (foto: File): Promise<{ url: string }> => {
  try {
    const formData = new FormData()
    formData.append('foto', foto)

    const response = await apiFishSpot.post('/upload/captura', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    
    return response.data
  } catch (error) {
    console.error('Error subiendo foto:', error)
    throw error
  }
}
