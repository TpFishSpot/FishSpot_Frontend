
import type React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DetalleSpot from "../components/DetalleSpot";
import { CrearSpot } from "../components/CrearSpot";
import { Mapa } from "../components/Mapa";
import DetalleEspecie from "../components/DetalleEspecie"
import { ListaPendientes } from "../components/ListarSpotsPendientes";
import Login from "../components/Login";

export const AppRoutes: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Mapa />} /> 
      <Route path="/ver/:id" element={<DetalleSpot />} />
      <Route path="/crear-spot" element={<CrearSpot />} />
      <Route path="/especie/:id" element={<DetalleEspecie/>} />
      <Route path="/spots/pendientes" element={<ListaPendientes />} />
      <Route path="/login" element={<Login/>} />
    </Routes>
  </BrowserRouter>
);
