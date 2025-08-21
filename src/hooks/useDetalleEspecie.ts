import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import apiFishSpot from "../api/apiFishSpot"
import type { EspecieConNombreComun } from "../modelo/EspecieConNombreComun"
import type { Carnada } from "../modelo/Carnada"
import type { TipoPesca } from "../modelo/TipoPesca"

interface DetalleEspecieResult {
  especie: EspecieConNombreComun | null
  carnadas: Carnada[]
  tiposPesca: TipoPesca[]
  cargando: boolean
  error: string | null
}

export function useDetalleEspecie(): DetalleEspecieResult {
  const { id } = useParams<{ id: string }>()
  const [especie, setEspecie] = useState<EspecieConNombreComun | null>(null)
  const [carnadas, setCarnadas] = useState<Carnada[]>([])
  const [tiposPesca, setTiposPesca] = useState<TipoPesca[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    async function fetchDetalle() {
      try {
        setCargando(true)
        setError(null)

        const respEspecie = await apiFishSpot.get(`/especie/${id}`)
        setEspecie(respEspecie.data)

        const respCarnadas = await apiFishSpot.get(`/especie/${id}/carnadas`)
        setCarnadas(respCarnadas.data || [])

      
        const respTipos = await apiFishSpot.get(`/especie/${id}/tipoPesca`)
      
        setTiposPesca(Array.isArray(respTipos.data) ? respTipos.data : [])

      } catch (err) {
        setError("Error cargando detalle de la especie")
      } finally {
        setCargando(false)
      }
    }

    fetchDetalle()
  }, [id])

  return { especie, carnadas, tiposPesca, cargando, error }
}
