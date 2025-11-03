import { useEffect, useMemo, useState } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet.heat'

interface HeatmapLayerProps {
  puntos: Array<{
    lat: number
    lng: number
    intensidad: number
  }>
  visible: boolean
}

declare module 'leaflet' {
  function heatLayer(
    latlngs: Array<[number, number, number]>,
    options?: any
  ): L.Layer
}

export const HeatmapLayer = ({ puntos, visible }: HeatmapLayerProps) => {
  const map = useMap()
  const [currentZoom, setCurrentZoom] = useState(map.getZoom())

  const heatData = useMemo(() => {
    return puntos.map(p => [p.lat, p.lng, p.intensidad] as [number, number, number])
  }, [puntos])

  // Calcular radio dinámico basado en el nivel de zoom
  // Zoom bajo (alejado) = radio grande, Zoom alto (cercano) = radio pequeño
  const getRadiusForZoom = (zoom: number): number => {
    if (zoom <= 6) return 80      // Muy alejado - radio muy grande
    if (zoom <= 8) return 60      // Alejado - radio grande
    if (zoom <= 10) return 45     // Medio-alejado - radio medio-grande
    if (zoom <= 12) return 35     // Medio - radio medio
    if (zoom <= 14) return 28     // Medio-cerca - radio medio-pequeño
    if (zoom <= 16) return 22     // Cerca - radio pequeño
    return 18                      // Muy cerca - radio muy pequeño
  }

  const getBlurForZoom = (zoom: number): number => {
    if (zoom <= 6) return 100     // Muy alejado - blur muy grande
    if (zoom <= 8) return 80      // Alejado - blur grande
    if (zoom <= 10) return 60     // Medio-alejado - blur medio-grande
    if (zoom <= 12) return 45     // Medio - blur medio
    if (zoom <= 14) return 35     // Medio-cerca - blur medio-pequeño
    if (zoom <= 16) return 28     // Cerca - blur pequeño
    return 22                      // Muy cerca - blur muy pequeño
  }

  useEffect(() => {
    if (!visible || heatData.length === 0) return

    const radius = getRadiusForZoom(currentZoom)
    const blur = getBlurForZoom(currentZoom)

    const heat = L.heatLayer(heatData, {
      radius: radius,
      blur: blur,
      minOpacity: 0.4,  // Opacidad mínima para que siempre sea visible
      max: 1.0,
      gradient: {
        0.0: '#3b82f6',   // Azul - baja intensidad
        0.3: '#22c55e',   // Verde - media-baja intensidad
        0.5: '#eab308',   // Amarillo - media intensidad
        0.7: '#f97316',   // Naranja - media-alta intensidad
        1.0: '#ef4444',   // Rojo - alta intensidad
      },
    })

    heat.addTo(map)

    // Listener para actualizar cuando cambia el zoom
    const onZoomEnd = () => {
      setCurrentZoom(map.getZoom())
    }

    map.on('zoomend', onZoomEnd)

    return () => {
      map.off('zoomend', onZoomEnd)
      map.removeLayer(heat)
    }
  }, [map, heatData, visible, currentZoom])

  return null
}
