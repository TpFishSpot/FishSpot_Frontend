import type React from "react"
import { BrowserRouter, Route, Routes } from "react-router"
import { Mapa } from "../components/Mapa"
import DetalleSpot from "../components/DetalleSpot"

export const AppRoutes: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route>
        <Route path="/" element={<Mapa />} />
        <Route path="/ver/:id" element={<DetalleSpot />} />
      </Route>
    </Routes>
  </BrowserRouter>
)
