import React from "react";
import type { Usuario } from "../../modelo/Usuario";

interface UsuarioCardProps {
  usuario: Usuario;
  onHacerModerador: (id: string) => void;
  esModerador: boolean;
}

const UsuarioCard: React.FC<UsuarioCardProps> = ({ usuario, onHacerModerador, esModerador }) => {
  const yaModerador = usuario.roles.some((r) => r.nombre === "moderador");

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{usuario.nombre}</h2>
        <p className="text-gray-600 mt-1">{usuario.email}</p>
        <p className="text-sm text-gray-500 mt-2">
          Roles: {usuario.roles.map((r) => r.nombre).join(", ")}
        </p>
      </div>
      {esModerador && !yaModerador && (
        <button
          onClick={() => onHacerModerador(usuario.id)}
          className="px-4 py-2 rounded-lg font-semibold bg-blue-500 text-white hover:bg-blue-600 transition"
        >
          Hacer Moderador
        </button>
      )}
    </div>
  );
};

export default UsuarioCard;
