import React from "react";
import type { Usuario } from "../../modelo/Usuario";
import { Link } from "react-router-dom";

interface UsuarioCardProps {
  usuario: Usuario;
  onHacerModerador: (id: string) => void;
  esModerador: boolean;
}

const UsuarioCard: React.FC<UsuarioCardProps> = ({ usuario, onHacerModerador, esModerador }) => {
  const yaModerador = usuario.roles.some((r) => r.nombre === "moderador");
  const fotoUsuario = usuario.foto;
  const foto = fotoUsuario 
    ? fotoUsuario?.startsWith('http') 
        ? fotoUsuario
        :`${import.meta.env.VITE_API_URL}${fotoUsuario}`
    : null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
          {foto ? (
            <img
              src={foto}
              alt={usuario.nombre}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-blue-500 text-white font-bold flex items-center justify-center">
              {usuario.nombre[0].toUpperCase()}
            </div>
          )}
        </div>

        <div>
          <Link to={`/profile/${usuario.id}`} className="group">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition">
              {usuario.nombre}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 group-hover:text-blue-500 transition">
              {usuario.email}
            </p>
          </Link>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Roles: {usuario.roles.map((r) => r.nombre).join(", ")}
          </p>
        </div>
      </div>
      {esModerador && !yaModerador && (
        <button
          onClick={() => onHacerModerador(usuario.id)}
          className="px-4 py-2 rounded-lg font-semibold bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 transition"
        >
          Hacer Moderador
        </button>
      )}
    </div>
  );
};

export default UsuarioCard;
