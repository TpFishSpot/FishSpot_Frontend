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
          <p className="text-sm text-gray-700 dark:text-gray-300">{spot.descripcion}</p>
          <button
            onClick={() => navigate(`/ver/${spot.id}`)}
            className="mt-3 w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-out flex items-center justify-center gap-2"
          >
            <span>Ver spot</span>
          </button>
        </div>
      </Popup>
    </Marker>
  );
}