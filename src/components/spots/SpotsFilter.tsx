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
          className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm transition-all active:scale-95 border ${
            selectedFilter === f.id
              ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/10"
              : "bg-card hover:bg-muted text-muted-foreground hover:text-foreground border-border"
          }`}
        >
          {f.name}
        </button>
      ))}
    </div>
  )
}
