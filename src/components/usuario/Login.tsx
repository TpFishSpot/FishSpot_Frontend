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
  const [theme] = useState<"light" | "dark">(
    localStorage.getItem("theme") === "dark" ? "dark" : "light"
  );

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

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
    <div className="min-h-screen flex items-center justify-center p-4 
                    bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 transition-colors">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 w-full max-w-md text-center transition-colors">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Iniciar sesión en FishSpot
        </h1>

        {error && (
          <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-300 px-4 py-3 rounded-lg mb-4 transition-colors">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-2 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 transition-colors"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 transition-colors"
        />
        <button
          onClick={handleEmailLogin}
          disabled={loadingEmail}
          className="w-full bg-gray-700 dark:bg-gray-600 hover:bg-gray-800 dark:hover:bg-gray-700 text-white py-2 rounded mb-4 disabled:opacity-50 transition-colors"
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

        <p className="text-sm mt-4 text-gray-700 dark:text-gray-300">
          ¿No tienes cuenta?{" "}
          <Link
            to="/registro"
            className="text-blue-600 dark:text-blue-400 hover:underline font-semibold transition-colors"
          >
            Créala aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
