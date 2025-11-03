interface SpotDescripcionProps {
  descripcion: string
}

export const SpotDescripcion = ({ descripcion }: SpotDescripcionProps) => {
  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-6">
      <h2 className="text-2xl font-bold text-card-foreground mb-4">
        Descripción
      </h2>
      <p className="text-foreground leading-relaxed text-lg">{descripcion}</p>
    </div>
  )
}
