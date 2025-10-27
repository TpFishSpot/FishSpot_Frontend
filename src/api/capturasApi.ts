import apiFishSpot from './apiFishSpot'
import type { Captura, NuevaCapturaData, EstadisticasCapturas } from '../modelo/Captura'

export const obtenerCapturas = async (usuarioId?: string): Promise<Captura[]> => {
  try {
    const url = usuarioId ? `/capturas/usuario/${usuarioId}` : '/capturas/mis-capturas'
    const response = await apiFishSpot.get(url)
    return response.data
  } catch (error) {
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

    if (captura.spotId) formData.append('spotId', captura.spotId)
    if (captura.latitud !== undefined) formData.append('latitud', captura.latitud.toString())
    if (captura.longitud !== undefined) formData.append('longitud', captura.longitud.toString())
    if (captura.peso) formData.append('peso', captura.peso.toString())
    if (captura.tamanio) formData.append('tamanio', captura.tamanio.toString())
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
    throw error
  }
}

export const eliminarCaptura = async (id: string): Promise<void> => {
  try {
    await apiFishSpot.delete(`/capturas/${id}`)
  } catch (error) {
    throw error
  }
}

export const obtenerEstadisticas = async (usuarioId?: string): Promise<EstadisticasCapturas> => {
  try {
    const url = usuarioId ? `/capturas/estadisticas/${usuarioId}` : '/capturas/mis-estadisticas'
    const response = await apiFishSpot.get(url)
    return response.data
  } catch (error) {
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
    throw error
  }
}

export const obtenerCapturasDestacadas = async (spotId: string): Promise<Captura[]> => {
  try {
    const response = await apiFishSpot.get(`/capturas/spot/${spotId}/destacadas`)
    return response.data
  } catch (error) {
    throw error
  }
}

export const obtenerEstadisticasSpot = async (spotId: string): Promise<any> => {
  try {
    const response = await apiFishSpot.get(`/capturas/spot/${spotId}/estadisticas`)
    return response.data
  } catch (error) {
    throw error
  }
}
