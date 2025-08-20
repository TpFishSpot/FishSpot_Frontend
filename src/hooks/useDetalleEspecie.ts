import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import apiFishSpot from "../api/apiFishSpot"
import type { EspecieConNombreComun } from "../modelo/EspecieConNombreComun"
import type { Carnada } from "../modelo/Carnada"

interface DetalleEspecieResult {
  especie: EspecieConNombreComun | null
  carnadas: Carnada[]
  tiposPesca: string[]
  cargando: boolean
  error: string | null
}

export function useDetalleEspecie(): DetalleEspecieResult {
  const { id } = useParams<{ id: string }>()
  const [especie, setEspecie] = useState<EspecieConNombreComun | null>(null)
  const [carnadas, setCarnadas] = useState<Carnada[]>([])
  const [tiposPesca, setTiposPesca] = useState<string[]>([])
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

        // Traer tipos de pesca
        // const respTipos = await apiFishSpot.get(`/especie/${id}/tipos-pesca`)        // lo comento porque todavia no lo tengo
        // setTiposPesca(respTipos.data || [])
        setTiposPesca([])

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
