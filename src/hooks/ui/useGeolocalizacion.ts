import { useState, useEffect } from 'react'
import type { LatLngExpression } from 'leaflet'

export const useGeolocalizacion = () => {
  const [position, setPosition] = useState<LatLngExpression | null>(null)
  const [cargandoPosicion, setCargandoPosicion] = useState(true)
  const [esUbicacionUsuario, setEsUbicacionUsuario] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const rioPlata: LatLngExpression = [-34.5522, -58.4454]

  useEffect(() => {
    if (!navigator.geolocation) {
      setPosition(rioPlata)
      setEsUbicacionUsuario(false)
      setCargandoPosicion(false)
      setError('Geolocalización no disponible')
      return
    }

    const obtenerPosicion = () => {
      navigator.geolocation.getCurrentPosition(
        (posicion) => {
          const { latitude, longitude } = posicion.coords
          setPosition([latitude, longitude])
          setEsUbicacionUsuario(true)
          setCargandoPosicion(false)
          setError(null)
        },
        (err) => {
          setPosition(rioPlata)
          setEsUbicacionUsuario(false)
          setCargandoPosicion(false)
          setError(err.message)
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        }
      )
    }

    obtenerPosicion()
  }, [])

  const recargarUbicacion = () => {
    setCargandoPosicion(true)
    setError(null)
    
    navigator.geolocation.getCurrentPosition(
      (posicion) => {
        const { latitude, longitude } = posicion.coords
        setPosition([latitude, longitude])
        setEsUbicacionUsuario(true)
        setCargandoPosicion(false)
      },
      (err) => {
        setPosition(rioPlata)
        setEsUbicacionUsuario(false)
        setCargandoPosicion(false)
        setError(err.message)
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    )
  }

  return { position, cargandoPosicion, esUbicacionUsuario, error, recargarUbicacion }
}
