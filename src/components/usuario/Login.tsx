import {
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useState, useEffect } from "react";
import { auth, googleProvider } from "../../auth/AuthFirebase";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Login() {
  const [error, setError] = useState("");
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    setError("");
    setLoadingGoogle(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      localStorage.setItem("token", token);
      navigate("/", { state: { message: "¡Te has logueado con éxito!" } });
    } catch (err: any) {
      setError("Error al iniciar sesión con Google. Inténtalo de nuevo.");
    } finally {
      setLoadingGoogle(false);
    }
  };

  const handleEmailLogin = async () => {
    setError("");
    setLoadingEmail(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      localStorage.setItem("token", token);
      navigate("/", { state: { message: "¡Login con Email exitoso!" } });
    } catch (err: any) {
      setError("Error al iniciar sesión con Email. Inténtalo de nuevo.");
    } finally {
      setLoadingEmail(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Iniciar sesión en FishSpot
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />
        <button
          onClick={handleEmailLogin}
          disabled={loadingEmail}
          className="w-full bg-gray-700 hover:bg-gray-800 text-white py-2 rounded mb-4 disabled:opacity-50"
        >
          {loadingEmail ? "Ingresando..." : "🔑 Ingresar con Email"}
        </button>

        <button
          onClick={handleGoogleLogin}
          disabled={loadingGoogle}
          className="flex items-center justify-center w-full gap-3 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
        >
          {loadingGoogle ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <span>🔴</span> Ingresar con Google
            </>
          )}
        </button>

        <p className="text-sm mt-4">
          ¿No tienes cuenta?{" "}
          <Link
            to="/registro"
            className="text-blue-600 hover:underline font-semibold"
          >
            Créala aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
