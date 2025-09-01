import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useUserRoles } from "../../hooks/useUserRoles";
import { useNavigate } from "react-router-dom";
import type { Usuario } from "../../modelo/Usuario";
import apiFishSpot from "../../api/apiFishSpot";
import NavigationBar from "../NavigationBar";
import UsuarioCard from "./usuarioCard";

export const ListaUsuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const { user } = useAuth();
  const { isModerator, loading: rolesLoading } = useUserRoles();
  const navigate = useNavigate();

  const cargarUsuarios = async () => {
    if (!user) {
      setError("Debes iniciar sesión para ver los usuarios");
      setLoading(false);
      return;
    }

    if (!isModerator) {
      setError("No tienes permisos para ver esta sección");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await apiFishSpot.get("/usuario");
      setUsuarios(res.data);
    } catch (err: any) {
      setError("Error al cargar los usuarios");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const hacerModerador = async (id: string) => {
    try {
      await apiFishSpot.patch(`/usuario/${id}/roles/moderador`);
      await cargarUsuarios();
    } catch (err) {
      alert("Error al asignar rol de moderador");
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, [user, isModerator]);

  if (!user || loading || rolesLoading) {
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
              onClick={() => navigate("/")}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
            >
              Volver
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
          <h1 className="text-3xl font-bold italic text-gray-900">Lista de Usuarios</h1>
          <button
            onClick={cargarUsuarios}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 font-semibold text-gray-700"
          >
            🔄 Actualizar
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {usuarios.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">
            🎉 No hay usuarios registrados
          </p>
        ) : (
          usuarios.map((u) => (
            <UsuarioCard
              key={u.id}
              usuario={u}
              onHacerModerador={hacerModerador}
              esModerador={isModerator}
            />
          ))
        )}
      </div>
    </div>
  );
};
