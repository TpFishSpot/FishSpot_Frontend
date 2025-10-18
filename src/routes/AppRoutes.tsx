import type React from "react";
import { lazy, Suspense } from "react"; 
import { Route, Routes } from "react-router-dom"; 
import { Mapa } from "../components/mapa/Mapa";
import Login from "../components/usuario/Login";
import Register from "../components/usuario/Register";
import ProtectedRoute from "../components/common/ProtectedRoute";
import { useAuth } from "../contexts/AuthContext";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { MobileLayout } from "../components/layouts/MobileLayout";

const DetalleSpot = lazy(() => import("../components/spots/DetalleSpot"));
const CrearSpot = lazy(() => import("../components/spots/CrearSpot").then(module => ({ default: module.CrearSpot })));
const DetalleEspecie = lazy(() => import("../components/especies/DetalleEspecie"));
const ListaSpots = lazy(() => import("../components/spots/ListarSpots").then(module => ({ default: module.ListaSpots })));
const GuiaEspecies = lazy(() => import("../components/especies/GuiaEspecies"));
const MisCapturas = lazy(() => import("../components/capturas/MisCapturas"));
const NuevaCaptura = lazy(() => import("../components/capturas/NuevaCaptura"));
const ListaUsuarios = lazy(() => import("../components/usuario/ListarUsuarios").then(module => ({ default: module.ListaUsuarios })));
const ListaCarnadas = lazy(() => import("../components/carnadas/ListaCarnadas"));
const EditarUsuario = lazy(() => import("../components/usuario/EditarUsuario").then(module => ({ default: module.EditarUsuario })));

export const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  return (
    <MobileLayout>
      <Routes>
        <Route path="/" element={<Mapa />} />
        <Route path="/mapa" element={<Mapa />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />

        <Route 
          path="/ver/:id" 
          element={
            <Suspense fallback={<LoadingSkeleton />}>
              <DetalleSpot />
            </Suspense>
          } 
        />
        <Route 
          path="/spots/:id" 
          element={
            <Suspense fallback={<LoadingSkeleton />}>
              <DetalleSpot />
            </Suspense>
          } 
        />
      <Route 
        path="/especie/:id" 
        element={
          <Suspense fallback={<LoadingSkeleton />}>
            <DetalleEspecie />
          </Suspense>
        } 
      />
      <Route 
        path="/especies-guide" 
        element={
          <Suspense fallback={<LoadingSkeleton />}>
            <GuiaEspecies />
          </Suspense>
        } 
      />
      <Route 
        path="/mis-capturas" 
        element={
          <Suspense fallback={<LoadingSkeleton />}>
            <MisCapturas />
          </Suspense>
        } 
      />
      <Route 
        path="/nueva-captura" 
        element={
          <Suspense fallback={<LoadingSkeleton />}>
            <NuevaCaptura />
          </Suspense>
        } 
      />
      <Route 
        path="/carnada" 
        element={
          <Suspense fallback={<LoadingSkeleton />}>
            <ListaCarnadas />
          </Suspense>
        } 
      />

      <Route
        path="/crear-spot"
        element={
          <ProtectedRoute>
            <Suspense fallback={<LoadingSkeleton />}>
              <CrearSpot />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/spots/pendientes"
        element={
          <ProtectedRoute>
            <Suspense fallback={<LoadingSkeleton />}>
              <ListaSpots />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route
        path="/usuarios"
        element={
          <ProtectedRoute>
            <Suspense fallback={<LoadingSkeleton />}>
              <ListaUsuarios />
            </Suspense>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/my-spots" 
        element={
          <ProtectedRoute>
            <Suspense fallback={<LoadingSkeleton />}>
              <ListaSpots idUsuario={user?.uid}/>
            </Suspense>
          </ProtectedRoute>
        } 
      /> 
      <Route 
        path="/profile" 
        element={
          <Suspense fallback={<LoadingSkeleton />}>
            <EditarUsuario/>
          </Suspense>
        } 
      />
      </Routes>
    </MobileLayout>
  );
};