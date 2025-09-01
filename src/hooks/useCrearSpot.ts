import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import apiFishSpot from "../api/apiFishSpot";
import type { EspecieConNombreComun } from "../modelo/EspecieConNombreComun";
import type { Carnada } from "../modelo/Carnada";
import type { TipoPesca } from "../modelo/TipoPesca";
import { useAuth } from "../contexts/AuthContext";
import { auth } from "../auth/AuthFirebase";

export function useCrearSpot() {
  const location = useLocation();
  const state = location.state as { lat: number; lng: number } | null;
  const navigate = useNavigate();
  const { user } = useAuth();

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);


  const [especies, setEspecies] = useState<EspecieConNombreComun[]>([]);
  const [todasEspecies, setTodasEspecies] = useState<EspecieConNombreComun[]>([]);
  const [carnadas, setCarnadas] = useState<Carnada[]>([]);
  const [tiposPesca, setTiposPesca] = useState<TipoPesca[]>([]);

  const [isDark, setIsDark] = useState(document.documentElement.classList.contains("dark"));

  
  useEffect(() => {
    const fetchEspecies = async () => {
      try {
        const res = await apiFishSpot.get<EspecieConNombreComun[]>("/especie");
        setTodasEspecies(res.data);
      } catch (err) {
      }
    };
    fetchEspecies();
  }, []);

  const addEspecie = (esp: EspecieConNombreComun): void => {
    if (!especies.find(e => e.id === esp.id)) {
      setEspecies([...especies, esp]);
    }
  };

  const removeEspecie = (id: string) => {
    setEspecies(especies.filter(e => e.id !== id));
  };

  const handleCarnadaChange = (nuevasCarnadas: Carnada[]) => {
    setCarnadas(nuevasCarnadas);
  };

  const handleTipoPescaChange = (nuevosTipos: TipoPesca[]) => {
    setTiposPesca(nuevosTipos);
  };

  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => setIsDark(root.classList.contains("dark")));
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagen(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };
  const clearImage = () => {
    setImagen(null);
    setImagePreview(null);
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!nombre.trim()) newErrors.nombre = "El nombre es requerido";
    else if (nombre.length < 3) newErrors.nombre = "El nombre debe tener al menos 3 caracteres";

    if (!descripcion.trim()) newErrors.descripcion = "La descripción es requerida";
    else if (descripcion.length < 10) newErrors.descripcion = "La descripción debe tener al menos 10 caracteres";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (!state?.lat || !state?.lng) {
      alert("No se encontraron coordenadas.");
      return;
    }

    setIsLoading(true);
    if (!user) {
      alert("Debes iniciar sesión para crear un spot");
      navigate("/login");
      return;
    }

    const formData = new FormData();
    formData.append("nombre", nombre.trim());
    formData.append("descripcion", descripcion.trim());
    formData.append("ubicacion", JSON.stringify({ type: "Point", coordinates: [state.lng, state.lat] }));
    formData.append("estado", "Esperando");
    formData.append("idUsuario", user.uid);
    formData.append("idUsuarioActualizo", user.uid);
    if (imagen) formData.append("imagen", imagen);

   
    if (especies.length > 0) {
      formData.append("especies", JSON.stringify(especies.map(e => e.id)));
    }
    if (carnadas.length > 0) {
      const carnadaData = carnadas.map(c => ({
        idEspecie: especies[0]?.id || "",
        idCarnada: c.idCarnada
      }));
      formData.append("carnadas", JSON.stringify(carnadaData));
    }
    if (tiposPesca.length > 0) {
      formData.append("tiposPesca", JSON.stringify(tiposPesca.map(t => t.id)));
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        alert("Debes estar logueado para crear un spot");
        navigate("/login");
        return;
      }
      
      await apiFishSpot.post("/spot", formData, { headers: { "Content-Type": "multipart/form-data" } });
      navigate("/", { state: { message: "¡Spot creado exitosamente!" } });
    } catch (err) {
      if (err instanceof Error) {
        alert(`Error al crear el spot: ${err.message}`);
      } else {
        alert("Error al crear el spot");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    nombre,
    setNombre,
    descripcion,
    setDescripcion,
    imagen,
    imagePreview,
    handleImageChange,
    clearImage,
    errors,
    isLoading,
    handleSubmit,
    isDark,
    lat: state?.lat,
    lng: state?.lng,
    navigate,
    especies,
    setEspecies,
    todasEspecies,
    addEspecie,
    removeEspecie,
    carnadas,
    setCarnadas: handleCarnadaChange,
    tiposPesca,
    setTiposPesca: handleTipoPescaChange,
  };
}
