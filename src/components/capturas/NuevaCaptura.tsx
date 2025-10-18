import { useNavigate, useLocation } from 'react-router-dom'
import { useCapturas } from '../../hooks/capturas/useCapturas'
import FormularioCaptura from './FormularioCaptura'
import type { NuevaCapturaData } from '../../modelo/Captura'

const NuevaCaptura = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { agregarCaptura } = useCapturas()
  
  const spotId = location.state?.spotId
  const coordenadas = location.state?.coordenadas

  const handleSave = async (captura: NuevaCapturaData) => {
    try {
      const capturaConDatos = {
        ...captura,
        spotId: spotId || captura.spotId,
        latitud: coordenadas?.lat || captura.latitud,
        longitud: coordenadas?.lng || captura.longitud
      }
      
      await agregarCaptura(capturaConDatos)
      navigate('/mis-capturas')
    } catch (error) {
      console.error('Error al crear captura:', error)
    }
  }

  const handleClose = () => {
    navigate(-1)
  }

  return <FormularioCaptura isOpen={true} onClose={handleClose} onSave={handleSave} />
}

export default NuevaCaptura
