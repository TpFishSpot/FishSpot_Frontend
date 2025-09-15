import { useEffect, useState } from "react";
import apiFishSpot from "../../api/apiFishSpot";
import { useAuth } from "../../contexts/AuthContext";
import type { Usuario } from "../../modelo/Usuario";

export function useUsuario() {
  const { user } = useAuth();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const cargarUsuario = async () => {
      try {
        const res = await apiFishSpot.get(`/usuario/${user.uid}`);
        setUsuario(res.data);
        } catch (error) {
            console.error("Error al cargar usuario", error);
        } finally {
            setLoading(false);
        }
    };

    cargarUsuario();
  }, [user]);

  return { usuario, loading, setUsuario };
}
