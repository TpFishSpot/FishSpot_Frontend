import { useEffect, useState } from "react"
import { useParams } from "react-router"
import type { Spot } from "../modelo/Spot"
import type { EspecieConNombreComun } from "../modelo/EspecieConNombreComun"
import apiFishSpot from "../api/apiFishSpot"

export function useDetalleSpot() {
  const { id: idSpot } = useParams<{ id: string }>()
  const [spot, setSpot] = useState<Spot | null>(null)
  const [especies, setEspecies] = useState<EspecieConNombreComun[]>([])
  const [cargando, setCargando] = useState(true)
  const [cargandoEspecies, setCargandoEspecies] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!idSpot) return

    const fetchSpot = async () => {
      try {
        setCargando(true)
        setError(null)
        const res = await apiFishSpot.get(`/spot/${idSpot}`)
        setSpot(res.data)
      } catch (err) {
        console.error("Error fetching spot:", err)
        setError("No se pudo cargar el spot")
      } finally {
        setCargando(false)
      }
    }

    const fetchEspecies = async () => {
      try {
        setCargandoEspecies(true)
        const res = await apiFishSpot.get(`/spot/${idSpot}/especies`)
        setEspecies(
          res.data.map((e: any, index: number) => ({
            id: e.id || index.toString(),
            nombre_cientifico: e.nombre_cientifico,
            descripcion: e.descripcion,
            nombre_comun: e.nombre_comun || [],
            imagen: e.imagen,
          }))
        )
      } catch (err) {
        console.error("Error fetching especies:", err)
        setEspecies([])
      } finally {
        setCargandoEspecies(false)
      }
    }

    fetchSpot()
    fetchEspecies()
  }, [idSpot])

  return { spot, especies, cargando, cargandoEspecies, error }
}