import React from "react"

type Props = {
  id: string
  onDelete: (id: string) => void
}

export const BotonBorrar: React.FC<Props> = ({ id, onDelete }) => (
  <button
    onClick={(e) => { e.stopPropagation(); onDelete(id) }}
    className="px-4 py-2 rounded-lg font-semibold bg-yellow-500 hover:bg-yellow-600 text-white transition"
  >
    🗑️ Borrar
  </button>
)
