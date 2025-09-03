import { useEffect, useState } from "react"
import apiFishSpot from "../../api/apiFishSpot"
import type { Spot } from "../../modelo/Spot"

export function useSpots() {
  const [spots, setSpots] = useState<Spot[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        setCargando(true)
        setError(null)
        const res = await apiFishSpot.get("/spot")
        setSpots(res.data)
      } catch (err) {
        setError("No se pudieron cargar los spots")
      } finally {
        setCargando(false)
      }
    }

    fetchSpots()
  }, [])

  return { spots, cargando, error }
}
