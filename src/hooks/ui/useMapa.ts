import { useMap, useMapEvent } from "react-leaflet";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function UseMapaLogic() {
  const navigate = useNavigate();
  const map = useMap();

  useMapEvent("mousedown", (e) => {
    const timeout = setTimeout(() => {
      const { lat, lng } = e.latlng;
      navigate("/crear-spot", { state: { lat, lng } });
    }, 800);

    const clear = () => clearTimeout(timeout);
    map.once("mouseup", clear);
    map.once("mousemove", clear);
  });

  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);

  return null;
}
