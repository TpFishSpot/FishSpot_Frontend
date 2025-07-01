import { useState } from "react"
import DetalleSpot from "./components/DetalleSpot"
import "./components/detalleSpot.css"
import "./App.css"

function App() {
  const [mostrarDetalle, establecerMostrarDetalle] = useState(false)

  return (
    <div className="app">
      {!mostrarDetalle ? (
        <div className="pagina-inicio">
          <div className="contenedor-inicio">
            <h1 className="titulo-app">🎣 Spots de Pesca</h1>
            <p className="descripcion-app">SI TOCAS EL SIGUIENTE BOTÓN VERÁS EL SPOT SECRETO</p>
            <button onClick={() => establecerMostrarDetalle(true)} className="boton-inicio">
              VER SPOT SECRETO
            </button>
          </div>
        </div>
      ) : (
        <div className="pagina-detalle">
          <button onClick={() => establecerMostrarDetalle(false)} className="boton-volver">
            ← Volver al inicio
          </button>
          <DetalleSpot idSpot="SpotSecreto" />
        </div>
      )}
    </div>
  )
}

export default App
