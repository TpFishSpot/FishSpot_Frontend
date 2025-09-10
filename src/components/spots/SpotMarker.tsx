import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useNavigate } from "react-router-dom";

const fishingIcon = L.icon({
  iconUrl: "/icons/fishing-spot-icon.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
  className: "rounded-full shadow-lg border-2 border-white",
});

export function SpotMarker({ spot }: { spot: any }) {
  const navigate = useNavigate();

  return (
    <Marker
      key={spot.id}
      position={[spot.ubicacion.coordinates[1], spot.ubicacion.coordinates[0]]}
      icon={fishingIcon}
    >
      <Popup>
        <div className="p-4 min-w-[200px]">
          <h3 className="font-bold text-lg mb-1">{spot.nombre}</h3>
          <p className="text-sm text-gray-600">{spot.descripcion}</p>
          <button
            onClick={() => navigate(`/ver/${spot.id}`)}
            className="mt-2 bg-blue-600 text-white px-3 py-1 rounded"
          >
            Ver detalles
          </button>
        </div>
      </Popup>
    </Marker>
  );
}