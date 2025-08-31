import { useState, useEffect } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../auth/AuthFirebase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/", { state: { message: "¡Te has logueado con éxito!" } });
    } catch (err: any) {
      setError("Error al iniciar sesión. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Iniciar sesión</h1>
        <p className="text-gray-600 mb-6">Ingresa con tu cuenta de Google para continuar</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="flex items-center justify-center w-full gap-3 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <span>🔴</span>
          )}
          {loading ? "Ingresando..." : "Ingresar con Google"}
        </button>
      </div>
    </div>
  );
}
