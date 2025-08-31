
import type React from "react";
import { Route, Routes } from "react-router-dom";
import DetalleSpot from "../components/DetalleSpot";
import { CrearSpot } from "../components/CrearSpot";
import { Mapa } from "../components/Mapa";
import DetalleEspecie from "../components/DetalleEspecie"
import { ListaPendientes } from "../components/ListarSpotsPendientes";
import Login from "../components/Login";
import ProtectedRoute from "../components/ProtectedRoute";

export const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/" element={<Mapa />} /> 
    <Route path="/ver/:id" element={<DetalleSpot />} />
    <Route path="/especie/:id" element={<DetalleEspecie />} />
    <Route 
      path="/crear-spot" 
      element={
        <ProtectedRoute>
          <CrearSpot />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/spots/pendientes" 
      element={
        <ProtectedRoute>
          <ListaPendientes />
        </ProtectedRoute>
      } 
    />
  </Routes>
);
