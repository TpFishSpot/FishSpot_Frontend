import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import apiFishSpot from "../api/apiFishSpot";

export function useCrearSpot() {
  const location = useLocation();
  const state = location.state as { lat: number; lng: number } | null;
  const navigate = useNavigate();


  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);


  const [isDark, setIsDark] = useState(document.documentElement.classList.contains("dark"));


  useState(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => setIsDark(root.classList.contains("dark")));
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  });


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
    const formData = new FormData();
    formData.append("nombre", nombre.trim());
    formData.append("descripcion", descripcion.trim());
    formData.append("ubicacion", JSON.stringify({ type: "Point", coordinates: [state.lng, state.lat] }));
    formData.append("estado", "Esperando");
    formData.append("idUsuario", "usuario1");
    formData.append("idUsuarioActualizo", "usuario1");
    if (imagen) formData.append("imagen", imagen);

    try {
      await apiFishSpot.post("/spot", formData, { headers: { "Content-Type": "multipart/form-data" } });
      navigate("/", { state: { message: "¡Spot creado exitosamente!" } });
    } catch (err) {
      console.error(err);
      alert("Error al crear el spot");
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
    navigate
  };
}
