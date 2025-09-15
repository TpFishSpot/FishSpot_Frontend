import { useState, useEffect } from 'react'
import type { LatLngExpression } from 'leaflet'

export const useGeolocalizacion = () => {
  const [position, setPosition] = useState<LatLngExpression | null>(null)
  const [cargandoPosicion, setCargandoPosicion] = useState(true)
  const [esUbicacionUsuario, setEsUbicacionUsuario] = useState(false)

  const rioPlata: LatLngExpression = [-34.5522, -58.4454]

  useEffect(() => {
    if (!navigator.geolocation) {
      setPosition(rioPlata)
      setEsUbicacionUsuario(false)
      setCargandoPosicion(false)
      return
    }

    const obtenerPosicion = () => {
      navigator.geolocation.getCurrentPosition(
        (posicion) => {
          const { latitude, longitude } = posicion.coords
          setPosition([latitude, longitude])
          setEsUbicacionUsuario(true)
          setCargandoPosicion(false)
        },
        () => {
          setPosition(rioPlata)
          setEsUbicacionUsuario(false)
          setCargandoPosicion(false)
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000
        }
      )
    }

    obtenerPosicion()
  }, [])

  return { position, cargandoPosicion, esUbicacionUsuario }
}
