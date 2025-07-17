import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import type { LatLngExpression } from 'leaflet'
import { useNavigate } from 'react-router-dom'

export const Mapa = () => {
  const position: LatLngExpression = [-35.7627, -58.4915]
  const navigate = useNavigate();

  const verSpotSecreto = () => {
    navigate('/ver/:SpotSecreto');
  }

  // const crearSpot = () => {
  //   navigate('/nuevo');       // falta completar, TODO
  // }

  return (
    <>
      <button onClick={verSpotSecreto}>
        ver SpotSecreto
      </button>

      {/* <button onClick={crearSpot}>
        crear Spot              // TODO
      </button> */}

      <MapContainer
        center={position}
        zoom={14.5}
        style={{ height: '99vh', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      </MapContainer>
    </>
    
  )
}
