import { useState, useEffect } from "react"
import apiFishSpot from "../api/apiFishSpot"
import { MapPin, Calendar, User, FileText, Clock, Navigation, Fish, Share2, Heart, Flag } from "lucide-react"
import type { Spot } from "../modelo/Spot"
import "./detalleSpot.css"
import "./lista-especies.css"
import type { EspecieConNombreComun } from "../modelo/EspecieConNombreComun"
import ListaEspecies from "./ListaEspecies"

interface PropiedadesDetalleSpot {
  idSpot?: string
  spot?: Spot
}

export default function DetalleSpot({ idSpot }: PropiedadesDetalleSpot) {
const [spot, establecerSpot] = useState<Spot | null>(null)
const [cargando, establecerCargando] = useState(true)
const [error, establecerError] = useState<string | null>(null)

const [especies, setEspecies] = useState<EspecieConNombreComun[]>([])
const [cargandoEspecies, setCargandoEspecies] = useState(true)

  useEffect(() => {
    if (idSpot) {
      obtenerSpot(idSpot)
      obtenerEspecies(idSpot)
    }
  }, [idSpot])

  const obtenerEspecies = async (id: string) => {
    try {
      setCargandoEspecies(true)
      const respuesta = await apiFishSpot.get(`/spot/${id}/especies`)
      const especiesFormateadas: EspecieConNombreComun[] = respuesta.data.map((e: any, i: number) => ({
        id: i.toString(),
        nombreCientifico: e.nombre_cientifico,
        descripcion: e.descripcion,
        nombresComunes: e.nombre_comun ?? [],
      }))
      setEspecies(especiesFormateadas)
    } catch (err) {
      console.error("Error al obtener especies:", err)
    } finally {
      setCargandoEspecies(false)
    }
  }

  const obtenerSpot = async (id: string) => {
  try {
    establecerCargando(true)
    const respuesta = await apiFishSpot.get<Spot>(`/spot/${id}`)
    const datosSpot = respuesta.data
    establecerSpot(datosSpot)
  } catch (err) {
    establecerError(err instanceof Error ? err.message : "Error desconocido")
  } finally {
    establecerCargando(false)
  }
}

  const obtenerColorEstado = (estado: string) => {
    switch (estado) {
      case "Aceptado":
        return "insignia estado-aceptado"
      case "Esperando":
        return "insignia estado-esperando"
      case "Rechazado":
        return "insignia estado-rechazado"
      case "Inactivo":
        return "insignia estado-inactivo"
      default:
        return "insignia estado-inactivo"
    }
  }

  const formatearFecha = (cadenaFecha: string) => {
    return new Date(cadenaFecha).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const obtenerTextoCoordenadas = (ubicacion: Spot["ubicacion"]) => {
    if (ubicacion?.coordinates) {
      const [lng, lat] = ubicacion.coordinates
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`
    }
    return "Coordenadas no disponibles"
  }

  const abrirEnMapas = (ubicacion: Spot["ubicacion"]) => {
    if (ubicacion?.coordinates) {
      const [lng, lat] = ubicacion.coordinates
      window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank")
    }
  }

  const manejarCompartir = () => {
    if (navigator.share && spot) {
      navigator.share({
        title: spot.nombre,
        text: spot.descripcion,
        url: window.location.href,
      })
    } else {
      // Fallback: copiar URL al portapapeles
      navigator.clipboard.writeText(window.location.href)
      alert("URL copiada al portapapeles")
    }
  }

  const manejarFavorito = () => {
    // Implementar lógica de favoritos
    console.log("Agregado a favoritos")
  }

  const manejarEditar = () => {
    // Implementar navegación a edición
    console.log("Editar spot")
  }

  const manejarReportar = () => {
    // Implementar reporte
    console.log("Reportar problema")
  }

  const manejarEliminar = () => {
    if (confirm("¿Estás seguro de que quieres eliminar este spot?")) {
      console.log("Eliminar spot")
    }
  }

  if (cargando) {
    return (
      <div className="cargando">
        <div className="spinner"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="contenedor-detalle">
        <div className="tarjeta">
          <div className="contenido-tarjeta">
            <div className="mensaje-error">
              <Flag className="icono-error" />
              <p className="titulo-error">Error al cargar el spot</p>
              <p className="texto-error">{error}</p>
              <button onClick={() => idSpot && obtenerSpot(idSpot)} className="boton boton-secundario">
                Intentar de nuevo
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!spot) {
    return (
      <div className="contenedor-detalle">
        <div className="tarjeta">
          <div className="contenido-tarjeta">
            <div className="mensaje-vacio">
              <Fish className="icono-vacio" />
              <p className="titulo-vacio">Spot no encontrado</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="contenedor-detalle">
      {/* Encabezado */}
      <div className="tarjeta">
        <div className="encabezado-tarjeta">
          <div className="encabezado-spot">
            <div className="info-spot">
              <h1 className="titulo-principal">
                <Fish className="icono-grande icono-azul" />
                {spot.nombre}
              </h1>
              <div className={obtenerColorEstado(spot.estado)}>{spot.estado}</div>
            </div>
            <div className="acciones-spot">
              <button onClick={manejarFavorito} className="boton boton-secundario">
                <Heart className="icono-pequeno" />
                Favorito
              </button>
              <button onClick={manejarCompartir} className="boton boton-secundario">
                <Share2 className="icono-pequeno" />
                Compartir
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grilla-contenido">
        {/* Contenido Principal */}
        <div className="contenido-principal">
          {/* Descripción */}
          <div className="tarjeta">
            <div className="encabezado-tarjeta">
              <h2 className="titulo-seccion">
                <FileText className="icono" />
                Descripción
              </h2>
            </div>
            <div className="contenido-tarjeta">
              <p className="descripcion-texto">{spot.descripcion || "Sin descripción disponible"}</p>
            </div>
          </div>

          {/* Especies observadas */}
          <div className="tarjeta">
            <div className="encabezado-tarjeta">
              <h2 className="titulo-seccion">
                <Fish className="icono" />
                Especies observadas
              </h2>
            </div>
            <div className="contenido-tarjeta">
              <ListaEspecies especies={especies} cargando={cargandoEspecies} />
            </div>
          </div>

          {/* Ubicación */}
          <div className="tarjeta">
            <div className="encabezado-tarjeta">
              <h2 className="titulo-seccion">
                <MapPin className="icono" />
                Ubicación
              </h2>
            </div>
            <div className="contenido-tarjeta">
              <div className="info-ubicacion">
                <div className="fila-coordenadas">
                  <span className="etiqueta-coordenadas">Coordenadas:</span>
                  <code className="coordenadas-codigo">{obtenerTextoCoordenadas(spot.ubicacion)}</code>
                </div>
                <button onClick={() => abrirEnMapas(spot.ubicacion)} className="boton boton-secundario boton-completo">
                  <Navigation className="icono-pequeno" />
                  Como Llegar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Barra Lateral */}
        <div className="barra-lateral">
          {/* Fechas */}
          <div className="tarjeta">
            <div className="encabezado-tarjeta">
              <h2 className="titulo-seccion">
                <Calendar className="icono" />
                Fechas
              </h2>
            </div>
            <div className="contenido-tarjeta">
              <div className="info-fechas">
                <div className="item-fecha">
                  <div className="etiqueta-fecha">
                    <Calendar className="icono-pequeno" />
                    Publicado
                  </div>
                  <p className="texto-fecha">{formatearFecha(spot.fechaPublicacion)}</p>
                </div>
                <div className="separador"></div>
                <div className="item-fecha">
                  <div className="etiqueta-fecha">
                    <Clock className="icono-pequeno" />
                    Última actualización
                  </div>
                  <p className="texto-fecha">{formatearFecha(spot.fechaActualizacion)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Usuarios */}
          <div className="tarjeta">
            <div className="encabezado-tarjeta">
              <h2 className="titulo-seccion">
                <User className="icono" />
                Información del usuario
              </h2>
            </div>
            <div className="contenido-tarjeta">
              <div className="info-usuarios">
                <div className="item-usuario">
                  <div className="etiqueta-usuario">
                    <User className="icono-pequeno" />
                    Creado por
                  </div>
                  <p className="texto-usuario">Usuario ID: {spot.idUsuario}</p>
                </div>
                <div className="separador"></div>
                <div className="item-usuario">
                  <div className="etiqueta-usuario">
                    <User className="icono-pequeno" />
                    Actualizado por
                  </div>
                  <p className="texto-usuario">Usuario ID: {spot.idUsuarioActualizo}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="tarjeta">
            <div className="encabezado-tarjeta">
              <h2 className="titulo-seccion">Acciones</h2>
            </div>
            <div className="contenido-tarjeta">
              <div className="acciones-lista">
                <button onClick={manejarEditar} className="boton boton-secundario boton-completo">
                  Editar spot
                </button>
                <button onClick={manejarReportar} className="boton boton-secundario boton-completo">
                  Reportar problema
                </button>
                <button onClick={manejarEliminar} className="boton boton-peligro boton-completo">
                  Eliminar spot
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}