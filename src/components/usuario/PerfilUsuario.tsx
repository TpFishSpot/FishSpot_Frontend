import { useUsuario } from "../../hooks/usuario/useUsuario";
import { useNavigate, useParams } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import NavigationBar from "../common/NavigationBar";
import MobileNavigationBar from "../common/MobileNavigationBar";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useState, useEffect } from "react";
import apiFishSpot from "../../api/apiFishSpot";
import { CapturasAnuales } from "./CapturasAnuales";
import type { Usuario } from "../../modelo/Usuario";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const PerfilUsuario = () => {
  const { id } = useParams<{ id: string }>();
  const { usuario: usuarioLogueado, loading } = useUsuario();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState<Usuario>();
  const [estadisticas, setEstadisticas] = useState({
    cantCapturas: 0,
    cantSpots: 0,
    cantComentarios: 0,
    racha: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!usuarioLogueado) return;
    const usuarioId = id || usuarioLogueado.id;

    const cargarUsuarioYStats = async () => {
      try {
        const { data: userData } = await apiFishSpot.get(`/usuario/${usuarioId}`);
        setUsuario(userData);

        const { data: statsData } = await apiFishSpot.get(`/usuario/${usuarioId}/estadisticas`);
        setEstadisticas(statsData);
      } catch (err) {
        console.error("Error al cargar perfil:", err);
      } finally {
        setLoadingStats(false);
      }
    };

    cargarUsuarioYStats();
  }, [id, usuarioLogueado]);

  if (loading || loadingStats) return <p className="text-center mt-10">Cargando perfil...</p>;
  if (!usuario) return <p className="text-center mt-10 text-red-500">Usuario no encontrado</p>;

  const fotoUsuario = usuario.foto;
  const foto = fotoUsuario
    ? fotoUsuario.startsWith("http")
      ? fotoUsuario
      : `${import.meta.env.VITE_API_URL}${fotoUsuario}`
    : null;

  const data = {
    labels: ["Capturas", "Spots", "Comentarios", "Racha"],
    datasets: [
      {
        label: "Actividad del usuario",
        data: [
          estadisticas.cantCapturas,
          estadisticas.cantSpots,
          estadisticas.cantComentarios,
          estadisticas.racha,
        ],
        backgroundColor: [
          "rgba(37, 99, 235, 0.6)",
          "rgba(16, 185, 129, 0.6)",
          "rgba(59, 130, 246, 0.8)",
        ],
        borderColor: [
          "rgba(37, 99, 235, 1)",
          "rgba(16, 185, 129, 1)",
          "rgba(59, 130, 246, 1)",
        ],
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false }, title: { display: false } },
    scales: { y: { beginAtZero: true } },
  };

  return (
    <div className="min-h-screen bg-background">
      {isMobile ? <MobileNavigationBar /> : <NavigationBar />}

      <div className="bg-card rounded-xl shadow-sm border border-border p-6 flex flex-col items-center text-center space-y-6 max-w-5xl mx-auto mt-8">
        {foto ? (
          <img
            src={foto}
            alt={usuario.nombre}
            onError={(e) => (e.currentTarget.style.display = "none")}
            className="w-24 h-24 rounded-full object-cover"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-bold">
            {usuario.nombre[0].toUpperCase()}
          </div>
        )}

        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {usuario.nombre}
          </h2>
          <p className="text-gray-500 text-sm">{usuario.email}</p>
        </div>

        {usuarioLogueado?.id === usuario.id && (
          <button
            onClick={() => {navigate('/EditarPerfil')}}
            className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
          >
            Editar usuario
          </button>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full text-sm text-gray-700 dark:text-gray-300">
          <div className="p-3 bg-muted rounded-lg">
            <p className="font-semibold text-lg">{estadisticas.cantCapturas}</p>
            <p>Capturas</p>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <p className="font-semibold text-lg">{estadisticas.cantSpots}</p>
            <p>Spots</p>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <p className="font-semibold text-lg">{estadisticas.cantComentarios}</p>
            <p>Comentarios</p>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <p className="font-semibold text-lg">{estadisticas.racha}</p>
            <p>Racha de capturas</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-6">
          <div className="bg-background rounded-xl p-4 shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
              Actividad reciente
            </h3>
            <Bar data={data} options={options} />
          </div>

          <div className="bg-background rounded-xl p-4 shadow-sm">
            <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
              Capturas último año
            </h3>
            <CapturasAnuales usuarioId={usuario.id} />
          </div>
        </div>
      </div>
    </div>
  );
};
