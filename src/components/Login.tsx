// src/components/Login.tsx
import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../auth/AuthFirebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setError("");
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/", { state: { message: "¡Te has logueado con exito paaAA!" } });
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Iniciar sesión</h1>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center w-full gap-3 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition"
        >
          <span>🔴</span>
          Ingresar con Google
        </button>
      </div>
    </div>
  );
}
