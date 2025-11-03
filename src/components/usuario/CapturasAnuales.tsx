import { useUsuario } from "../../hooks/usuario/useUsuario";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { useEffect, useState } from "react";
import apiFishSpot from "../../api/apiFishSpot";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend);

interface CapturasPorMes {
  mes: string;
  cantidad: number;
}

interface CapturasAnualesProps {
  usuarioId?: string;
}

export const CapturasAnuales = ({ usuarioId }: CapturasAnualesProps) => {
  const { usuario } = useUsuario();
  const [datos, setDatos] = useState<number[]>(Array(12).fill(0));

  const labels = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

  useEffect(() => {
    const id = usuarioId || usuario?.id;
    if (!id) return;

    const cargarCapturas = async () => {
      try {
        const { data } = await apiFishSpot.get<CapturasPorMes[]>(`/capturas/${id}/capturasMensuales`);
        const meses = Array(12).fill(0);

        data.forEach(d => {
          const idx = labels.findIndex(l => l.toLowerCase() === d.mes.toLowerCase().slice(0,3));
          if (idx !== -1) meses[idx] = d.cantidad;
        });

        setDatos(meses);
      } catch (err) {
        console.error(err);
      }
    };

    cargarCapturas();
  }, [usuario, usuarioId]);

  const chartData: ChartData<"bar" | "line", number[], string> = {
    labels,
    datasets: [
      {
        type: "bar" as const,
        label: "Capturas por mes",
        data: datos,
        backgroundColor: "rgba(37, 99, 235, 0.6)"
      },
      {
        type: "line" as const,
        label: "Promedio acumulado",
        data: datos.map((_, i) => datos.slice(0, i + 1).reduce((a,b) => a+b,0)/(i+1)),
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
        fill: false,
        tension: 0.3,
        pointBackgroundColor: "rgba(255, 99, 132, 1)"
      }
    ]
  };

  const options: ChartOptions<"bar" | "line"> = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: { mode: "index", intersect: false }
    },
    scales: {
      x: { stacked: false },
      y: { beginAtZero: true, stacked: false }
    }
  };

  return <Chart type="bar" data={chartData} options={options} />;
};
