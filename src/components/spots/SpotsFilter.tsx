import React from "react"

interface Props {
  filtros: { id: string; name: string }[]
  selectedFilter: string
  onSelect: (id: string) => void
}

export const SpotsFilter: React.FC<Props> = ({ filtros, selectedFilter, onSelect }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {filtros.map(f => (
        <button
          key={f.id}
          onClick={() => onSelect(f.id)}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            selectedFilter === f.id
              ? "bg-blue-500 dark:bg-blue-600 text-white"
              : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
          }`}
        >
          {f.name}
        </button>
      ))}
    </div>
  )
}
