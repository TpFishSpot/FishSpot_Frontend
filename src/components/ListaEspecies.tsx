import type { EspecieConNombreComun } from "../modelo/EspecieConNombreComun"

interface Props {
  especies: EspecieConNombreComun[]
  cargando: boolean
}

export default function ListaEspecies({ especies, cargando }: Props) {
  if (cargando) {
    return <p>Cargando especies...</p>
  }

  if (especies.length === 0) {
    return <p>No se registraron especies en este spot.</p>
  }

  return (
    <ul className="lista-especies">
      {especies.map((especie) => (
        <li key={especie.id}>
          <strong>{especie.nombreCientifico}</strong>
          <br />
          <small>
            Nombres comunes:{" "}
            {Array.isArray(especie.nombresComunes) && especie.nombresComunes.length > 0
              ? especie.nombresComunes.join(", ")
              : "No especificados"}
          </small>
        </li>
      ))}
    </ul>
  )
}
