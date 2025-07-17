import { BrowserRouter, Route, Routes } from "react-router";
import { Mapa } from "../components/Mapa";
import DetalleSpot from "../components/DetalleSpot";


export const AppRoutes: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route>
        <Route path="/" element={<Mapa />} />
        {/* <Route path="/nuevo" element={<CrearSpotForm idUsuario={""} idUsuarioActualizo={""} />} /> */}     {/* TODO*/ } 
        <Route path="/ver/:id" element={<DetalleSpot idSpot="SpotSecreto"/>} />   
      </Route>
    </Routes>
  </BrowserRouter>
);