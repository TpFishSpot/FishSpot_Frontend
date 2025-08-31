import { MapContainer, TileLayer } from "react-leaflet";
import { SpotMarker } from "./SpotMarker";
import { UseMapaLogic } from "../hooks/useMapa";
import { useSpots } from "../hooks/useSpots";
import NavigationBar from "./NavigationBar";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

export const Mapa = () => {
  const initialPosition: LatLngExpression = [-35.7627, -58.4915];
  const { spots, cargando } = useSpots();

  if (cargando) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando spots...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col">
      <NavigationBar />
      <div className="flex-1">
        <MapContainer center={initialPosition} zoom={14} className="h-full w-full z-0">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          <UseMapaLogic />

          {spots.map((spot) => (
            <SpotMarker key={spot.id} spot={spot} />
          ))}
        </MapContainer>
      </div>
    </div>
  );
};
