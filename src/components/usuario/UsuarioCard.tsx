import React from "react";
import type { Usuario } from "../../modelo/Usuario";

interface UsuarioCardProps {
  usuario: Usuario;
  onHacerModerador: (id: string) => void;
  esModerador: boolean;
}

const UsuarioCard: React.FC<UsuarioCardProps> = ({ usuario, onHacerModerador, esModerador }) => {
  const yaModerador = usuario.roles.some((r) => r.nombre === "moderador");
  const inicial = usuario.nombre?.[0]?.toUpperCase() ?? "U";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-lg font-semibold">
          {inicial}
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{usuario.nombre}</h2>
          <p className="text-gray-600 dark:text-gray-300">{usuario.email}</p>
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
