import type React from "react"
import { BrowserRouter, Route, Routes } from "react-router"
import { Mapa } from "../components/Mapa"
import DetalleSpot from "../components/DetalleSpot"
import DetalleEspecie from "../components/DetalleEspecie"

export const AppRoutes: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route>
        <Route path="/" element={<Mapa />} />
        <Route path="/ver/:id" element={<DetalleSpot />} />
        <Route path="/especie/:id" element={<DetalleEspecie/>} />
      </Route>
    </Routes>
  </BrowserRouter>
)
