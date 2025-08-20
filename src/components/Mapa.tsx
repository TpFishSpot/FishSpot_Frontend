import { MapContainer, TileLayer } from "react-leaflet";
import { SpotMarker } from "./SpotMarker";
import { UseMapaLogic } from "../hooks/useMapa";
import { useSpots } from "../hooks/useSpots";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

export const Mapa = () => {
  const initialPosition: LatLngExpression = [-35.7627, -58.4915];
  const { spots, cargando } = useSpots();

  if (cargando) return <div>Cargando spots...</div>;

  return (
    <div className="h-screen w-screen">
      <MapContainer center={initialPosition} zoom={14} className="h-screen w-screen z-0">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {/* 📌 Toda la lógica metida dentro del contexto */}
        <UseMapaLogic />

        {spots.map((spot) => (
          <SpotMarker key={spot.id} spot={spot} />
        ))}
      </MapContainer>
    </div>
  );
};
