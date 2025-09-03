import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import type { Spot } from "../../modelo/Spot"
import apiFishSpot from "../../api/apiFishSpot"
import { useAuth } from "../../contexts/AuthContext"
import { useUserRoles } from "../../hooks/auth/useUserRoles"
import NavigationBar from "../common/NavigationBar"

export const ListaPendientes: React.FC = () => {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const { user } = useAuth();
  const { loading: rolesLoading } = useUserRoles();
  const navigate = useNavigate();

  const cargarPendientes = async () => {
    if (!user) {
      setError("Debes iniciar sesión para ver los spots pendientes");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await apiFishSpot.get("/spot/esperando");
      setSpots(res.data);
    } catch (error: any) {
      if (error.response?.status === 403) {
        setError("No tienes permisos para ver los spots pendientes");
      } else {
        setError("Error al cargar los spots pendientes");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPendientes();
  }, [user]);

  const aprobar = async (id: string) => {
    try {
      await apiFishSpot.patch(`/spot/${id}/aprobar`);
      setSpots(spots.filter((s) => s.id !== id));
    } catch (error) {
      alert("Error al aprobar el spot");
    }
  };

  const rechazar = async (id: string) => {
    try {
      await apiFishSpot.patch(`/spot/${id}/rechazar`);
      setSpots(spots.filter((s) => s.id !== id));
    } catch (error) {
      alert("Error al rechazar el spot");
    }
  };

  const verEnMapa = (spot: Spot) => {
    const [lng, lat] = spot.ubicacion.coordinates;
    window.open(
      `https://www.google.com/maps?q=${lat},${lng}`,
      "_blank"
    );
  };

  if (!user || rolesLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <NavigationBar />
        <div className="container mx-auto p-6">
          <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Error</h2>
            <p>{error}</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
            >
              Volver al mapa
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <NavigationBar />

      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold italic text-gray-900">
            Spots pendientes
          </h1>
          <button
            onClick={cargarPendientes}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 font-semibold text-gray-700"
          >
            🔄 Actualizar
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {spots.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            🎉 No hay spots pendientes
          </p>
        ) : (
          spots.map((spot) => (
            <div
              key={spot.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {spot.nombre}
                  </h2>
                  <p className="text-gray-600 mt-1">{spot.descripcion}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Publicado: {spot.fechaPublicacion}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => aprobar(spot.id)}
                    className="px-4 py-2 rounded-lg font-semibold bg-green-500 text-white hover:bg-green-600 transition"
                  >
                    ✅ Aprobar
                  </button>
                  <button
                    onClick={() => rechazar(spot.id)}
                    className="px-4 py-2 rounded-lg font-semibold bg-red-500 text-white hover:bg-red-600 transition"
                  >
                    ❌ Rechazar
                  </button>
                  <button
                    onClick={() => verEnMapa(spot)}
                    className="px-4 py-2 rounded-lg font-semibold bg-blue-500 text-white hover:bg-blue-600 transition"
                  >
                    🗺️ Ver en mapa
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
