import { useState } from "react";
import ComentarioForm from "./ComentarioForm";
import type { Comentario } from "../../modelo/Comentario";

interface Props {
  comentario: Comentario;
  onResponder?: (idComentarioPadre: string, contenido: string) => void;
  puedeResponder?: boolean;
}

export const ComentarioItem = ({
  comentario,
  onResponder,
  puedeResponder = true,
}: Props) => {
  const [respondiendo, setRespondiendo] = useState(false);
  const [respuesta, setRespuesta] = useState("");
  const foto = `${import.meta.env.VITE_API_URL}${comentario.usuario.foto}` || '';

  const enviarRespuesta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!respuesta.trim() || !onResponder) return;

    onResponder(comentario.id, respuesta);

    setRespuesta("");
    setRespondiendo(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 mb-3 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center mb-2">
        {foto ? (
          <img
            src={foto}
            alt={comentario.usuario.nombre}
            className="w-8 h-8 rounded-full mr-2"
          />
        ) : (
          <div className="w-8 h-8 bg-blue-500 text-white font-bold rounded-full flex items-center justify-center mr-2">
            {comentario.usuario.nombre[0].toUpperCase()}
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {comentario.usuario.nombre}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(comentario.fecha).toLocaleDateString()}
          </p>
        </div>
      </div>

      <p className="text-gray-800 dark:text-gray-200 mb-2">{comentario.contenido}</p>

      {puedeResponder && (
        <button
          onClick={() => setRespondiendo((prev) => !prev)}
          className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          {respondiendo ? "Cancelar" : "Responder"}
        </button>
      )}

      {respondiendo && (
        <div className="mt-2 ml-10">
          <ComentarioForm
            nuevoComentario={respuesta}
            setNuevoComentario={setRespuesta}
            enviarComentario={enviarRespuesta}
            esRespuesta
          />
        </div>
      )}

      {comentario.respuestas && comentario.respuestas.length > 0 && (
        <div className="ml-10 mt-3 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
          {comentario.respuestas.map((r) => (
            <ComentarioItem
              key={`${r.id}-${r.fecha}`}
              comentario={r}
              onResponder={onResponder}
              puedeResponder={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}
