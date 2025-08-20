import type React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DetalleSpot from "../components/DetalleSpot";
import { CrearSpot } from "../components/CrearSpot";
import { Mapa } from "../components/Mapa"; 

export const AppRoutes: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Mapa />} /> 
      <Route path="/ver/:id" element={<DetalleSpot />} />
      <Route path="/crear-spot" element={<CrearSpot />} />
    </Routes>
  </BrowserRouter>
);
