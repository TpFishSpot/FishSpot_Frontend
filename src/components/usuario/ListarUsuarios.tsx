import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useUserRoles } from "../../hooks/auth/useUserRoles";
import { useNavigate } from "react-router-dom";
import type { Usuario } from "../../modelo/Usuario";
import apiFishSpot from "../../api/apiFishSpot";
import NavigationBar from "../common/NavigationBar";
import MobileNavigationBar from "../common/MobileNavigationBar";
import UsuarioCard from "./UsuarioCard";
import { useIsMobile } from "../../hooks/useIsMobile";

export const ListaUsuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const { user } = useAuth();
  const { isModerator, loading: rolesLoading } = useUserRoles();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

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
    } finally {
      setLoading(false);
    }
  };

  const hacerModerador = async (id: string) => {
    try {
      await apiFishSpot.patch(`/usuario/${id}/rol/moderador`);
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
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <NavigationBar />
        <div className="container mx-auto p-6">
          <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-300 px-6 py-4 rounded-lg">
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
    <div 
      className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800"
      style={
        isMobile
          ? {
              paddingBottom: "max(96px, calc(96px + env(safe-area-inset-bottom)))",
            }
          : {}
      }
    >
      {isMobile ? <MobileNavigationBar /> : <NavigationBar />}
      <div 
        className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm"
        style={
          isMobile
            ? {
                marginTop: "max(56px, calc(56px + env(safe-area-inset-top)))",
              }
            : {}
        }
      >
        <div className={`max-w-6xl mx-auto flex items-center justify-between ${isMobile ? 'px-3 py-4' : 'px-4 py-6'}`}>
          {isMobile && (
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Volver</span>
            </button>
          )}
          <h1 className={`font-bold italic text-gray-900 dark:text-white ${isMobile ? 'text-xl' : 'text-3xl'}`}>
            {isMobile ? 'Usuarios' : 'Lista de Usuarios'}
          </h1>
          <button
            onClick={cargarUsuarios}
            className={`rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 font-semibold text-gray-700 dark:text-gray-200 transition-all active:scale-95 ${
              isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-2'
            }`}
          >
            {isMobile ? '🔄' : '🔄 Actualizar'}
          </button>
        </div>
      </div>

      <div className={`max-w-6xl mx-auto space-y-4 sm:space-y-6 ${isMobile ? 'px-3 py-4' : 'px-4 py-8'}`}>
        {usuarios.length === 0 ? (
          <p className={`text-center text-gray-600 dark:text-gray-300 ${isMobile ? 'text-base' : 'text-lg'}`}>
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
