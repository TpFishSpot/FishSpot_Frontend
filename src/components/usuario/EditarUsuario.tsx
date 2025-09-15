import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useUsuario } from "../../hooks/usuario/useUsuario";
import apiFishSpot from "../../api/apiFishSpot";
import { useNavigate } from "react-router-dom";

export const EditarUsuario: React.FC = () => {
  const { user } = useAuth();
  const { usuario, loading } = useUsuario();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!usuario) return;
    setNombre(usuario.nombre || user?.displayName || "");
    setImagePreview(usuario.foto || user?.photoURL || undefined);
  }, [usuario, user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
    }
  };

  const clearImage = () => {
    setFile(null);
    setImagePreview(undefined);
  };

  const manejarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

  const usuarioActualizadoData = new FormData();
  usuarioActualizadoData.append("nombre", nombre);
  if (file) usuarioActualizadoData.append("foto", file);

    try {
      await apiFishSpot.patch(`/usuario/${user.uid}/actualizar`, usuarioActualizadoData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Usuario actualizado!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Error al actualizar");
    }
  };

  if (loading) return <p className="text-center mt-4">Cargando usuario...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <form
        onSubmit={manejarSubmit}
        className="w-full max-w-md bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6 flex flex-col gap-4"
      >
        <h2 className="text-xl font-bold text-center text-gray-900 dark:text-gray-100">Editar Usuario</h2>

        <div className="flex flex-col items-center gap-2">
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Foto de perfil"
                className="w-24 h-24 rounded-full object-cover border"
              />
              <button
                type="button"
                onClick={clearImage}
                className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 transition-colors"
              >
                ×
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-full cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <p className="text-sm text-gray-400 dark:text-gray-300 text-center">Haz clic para subir</p>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
            </label>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
          <input
            type="email"
            value={usuario?.email || user?.email || ""}
            className="w-full p-2 border rounded-md bg-gray-200 dark:bg-gray-600 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 cursor-not-allowed"
            readOnly
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
        >
          Guardar cambios
        </button>
      </form>
    </div>
  );
};
