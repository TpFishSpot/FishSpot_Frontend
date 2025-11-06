import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth"
import { useState, useEffect } from "react"
import { auth, googleProvider } from "../../auth/AuthFirebase"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { ArrowLeft, Fish, Mail, Lock, Chrome } from "lucide-react"

export default function Login() {
  const [error, setError] = useState("")
  const [loadingEmail, setLoadingEmail] = useState(false)
  const [loadingGoogle, setLoadingGoogle] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [theme] = useState<"light" | "dark">(localStorage.getItem("theme") === "dark" ? "dark" : "light")

  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    localStorage.setItem("theme", theme)
  }, [theme])

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true })
    }
  }, [user, navigate])

  const handleGoogleLogin = async () => {
    setError("")
    setLoadingGoogle(true)

    try {
      const result = await signInWithPopup(auth, googleProvider)
      const token = await result.user.getIdToken()
      localStorage.setItem("token", token)
      navigate("/", { state: { message: "¡Te has logueado con éxito!" } })
    } catch (err: any) {
      setError("Error al iniciar sesión con Google. Inténtalo de nuevo.")
    } finally {
      setLoadingGoogle(false)
    }
  }

  const handleEmailLogin = async () => {
    setError("")
    setLoadingEmail(true)

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const token = await userCredential.user.getIdToken()
      localStorage.setItem("token", token)
      navigate("/", { state: { message: "¡Login con Email exitoso!" } })
    } catch (err: any) {
      setError("Error al iniciar sesión con Email. Inténtalo de nuevo.")
    } finally {
      setLoadingEmail(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 pb-safe
                    bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 
                    dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors"
    >
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 left-4 sm:top-6 sm:left-6 z-10 flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-md hover:shadow-lg transition-all"
      >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
        <span className="text-sm font-medium text-foreground hidden sm:inline">Volver</span>
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 sm:p-8 w-full max-w-md transition-colors">
        {/* Logo and title */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl mb-4 shadow-lg">
            <Fish className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Bienvenido a FishSpot
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Inicia sesión para continuar</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 px-4 py-3 rounded-lg mb-6 text-sm transition-colors">
            {error}
          </div>
        )}

        {/* Email login form */}
        <div className="space-y-4 mb-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-colors"
              />
            </div>
          </div>

          <button
            onClick={handleEmailLogin}
            disabled={loadingEmail || !email || !password}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 
                     text-white font-semibold py-3 rounded-lg 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200 shadow-md hover:shadow-lg
                     flex items-center justify-center gap-2"
          >
            {loadingEmail ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Ingresando...</span>
              </>
            ) : (
              <>
                <Mail className="w-5 h-5" />
                <span>Ingresar con Email</span>
              </>
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">O continúa con</span>
          </div>
        </div>

        {/* Google login */}
        <button
          onClick={handleGoogleLogin}
          disabled={loadingGoogle}
          className="w-full flex items-center justify-center gap-3 
                   bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600
                   border-2 border-gray-300 dark:border-gray-600
                   text-gray-700 dark:text-gray-200 font-semibold py-3 rounded-lg 
                   transition-all duration-200 shadow-sm hover:shadow-md
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loadingGoogle ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-700 dark:border-gray-200 border-t-transparent"></div>
          ) : (
            <>
              <Chrome className="w-5 h-5 text-red-500" />
              <span>Ingresar con Google</span>
            </>
          )}
        </button>

        {/* Sign up link */}
        <p className="text-sm sm:text-base mt-6 sm:mt-8 text-center text-gray-600 dark:text-gray-400">
          ¿No tienes cuenta?{" "}
          <Link
            to="/registro"
            className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-semibold hover:underline transition-colors"
          >
            Créala aquí
          </Link>
        </p>
      </div>
    </div>
  )
}
