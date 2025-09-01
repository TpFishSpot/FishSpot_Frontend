
import type React from "react";
import { Route, Routes } from "react-router-dom";
import DetalleSpot from "../components/DetalleSpot";
import { CrearSpot } from "../components/CrearSpot";
import { Mapa } from "../components/Mapa";
import DetalleEspecie from "../components/DetalleEspecie"
import { ListaPendientes } from "../components/ListarSpotsPendientes";
import Login from "../components/Login";
import Register from "../components/Register";
import ProtectedRoute from "../components/ProtectedRoute";
import GuiaEspecies from "../components/GuiaEspecies";
import MisCapturas from "../components/MisCapturas";

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
      <Route path="/especie/:id" element={<DetalleEspecie/>} />
      <Route 
      path="/spots/pendientes" 
      element={
        <ProtectedRoute>
          <ListaPendientes />
        </ProtectedRoute>
      } 
    />
      <Route path="/login" element={<Login/>} />
      <Route path="/registro" element={<Register/>}/>
    </Routes>
);
