
import type React from "react";
import { Route, Routes } from "react-router-dom";
import DetalleSpot from "../components/spots/DetalleSpot";
import { CrearSpot } from "../components/spots/CrearSpot";
import { Mapa } from "../components/mapa/Mapa";
import DetalleEspecie from "../components/especies/DetalleEspecie"
import { ListaSpots } from "../components/spots/ListarSpots";
import Login from "../components/usuario/Login";
import Register from "../components/usuario/Register";
import ProtectedRoute from "../components/common/ProtectedRoute";
import GuiaEspecies from "../components/especies/GuiaEspecies";
import MisCapturas from "../components/capturas/MisCapturas";
import { ListaUsuarios } from "../components/usuario/ListarUsuarios";
import ListaCarnadas from "../components/carnadas/ListaCarnadas";

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
          <ListaSpots />
        </ProtectedRoute>
      }
    />
      <Route path="/login" element={<Login/>} />
      <Route path="/registro" element={<Register/>}/>
      <Route path="/especies-guide" element={<GuiaEspecies/>} />
      <Route path="/mis-capturas" element={<MisCapturas/>} />
      <Route path="/carnada" element={<ListaCarnadas/>} />
      <Route path="/usuarios" element={
        <ProtectedRoute>
          <ListaUsuarios/>
        </ProtectedRoute>
        }
      />
    </Routes>
);
