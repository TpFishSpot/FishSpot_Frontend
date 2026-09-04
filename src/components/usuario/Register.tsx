import { useState, useEffect } from "react"
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth"
import { useNavigate, Link } from "react-router-dom"
import { auth, googleProvider } from "../../auth/AuthFirebase"
import { useAuth } from "../../contexts/AuthContext"
import { ArrowLeft, Fish, Mail, Lock, Chrome, UserPlus } from "lucide-react"

export default function Register() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loadingEmail, setLoadingEmail] = useState(false)
  const [loadingGoogle, setLoadingGoogle] = useState(false)
  const [theme] = useState<"light" | "dark">(
    localStorage.getItem("theme") === "dark" ? "dark" : "light"
  )

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

  const handleGoogleRegister = async () => {
    setError("")
    setLoadingGoogle(true)

    try {
      const result = await signInWithPopup(auth, googleProvider)
      const token = await result.user.getIdToken()
      localStorage.setItem("token", token)
      navigate("/", { state: { message: "¡Registro exitoso con Google!" } })
    } catch (err: any) {
      setError("Error al registrarse con Google. Inténtalo de nuevo.")
    } finally {
      setLoadingGoogle(false)
    }
  }

  const handleEmailRegister = async () => {
    setError("")

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.")
      return
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.")
      return
    }

    setLoadingEmail(true)

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const token = await userCredential.user.getIdToken()
      localStorage.setItem("token", token)
      navigate("/", { state: { message: "¡Cuenta creada con éxito!" } })
    } catch (err: any) {
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("Este correo ya está registrado. Prueba iniciando sesión.")
          break
        case "auth/invalid-email":
          setError("El formato del correo no es válido.")
          break
        case "auth/weak-password":
          setError("La contraseña es muy débil (mínimo 6 caracteres).")
          break
        default:
          setError("Ocurrió un error al registrarte. Inténtalo de nuevo.")
      }
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
            Únete a FishSpot
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Crea tu cuenta gratis para compartir spots y capturas
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 px-4 py-3 rounded-lg mb-6 text-sm transition-colors">
            {error}
          </div>
        )}

        {/* Google Register (1-Click Primary Option) */}
        <button
          onClick={handleGoogleRegister}
          disabled={loadingGoogle}
          className="w-full flex items-center justify-center gap-3 
                   bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600
                   border-2 border-gray-300 dark:border-gray-600
                   text-gray-800 dark:text-gray-100 font-semibold py-3 rounded-xl 
                   transition-all duration-200 shadow-sm hover:shadow-md mb-6
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loadingGoogle ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-700 dark:border-gray-200 border-t-transparent"></div>
          ) : (
            <>
              <Chrome className="w-5 h-5 text-red-500" />
              <span>Registrarse con Google</span>
            </>
          )}
        </button>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
              O con tu correo electrónico
            </span>
          </div>
        </div>

        {/* Email registration form */}
        <div className="space-y-4 mb-6">
          <div className="space-y-1.5">
            <label htmlFor="reg-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="reg-email"
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

          <div className="space-y-1.5">
            <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="reg-password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="reg-confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirmar contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="reg-confirm-password"
                type="password"
                placeholder="Repite tu contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                         focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         transition-colors"
              />
            </div>
          </div>

          <button
            onClick={handleEmailRegister}
            disabled={loadingEmail || !email || !password || !confirmPassword}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 
                     text-white font-semibold py-3 rounded-lg 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200 shadow-md hover:shadow-lg
                     flex items-center justify-center gap-2"
          >
            {loadingEmail ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Creando cuenta...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                <span>Crear cuenta con Email</span>
              </>
            )}
          </button>
        </div>

        {/* Login link */}
        <p className="text-sm sm:text-base mt-6 sm:mt-8 text-center text-gray-600 dark:text-gray-400">
          ¿Ya tienes cuenta?{" "}
          <Link
            to="/login"
            className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-semibold hover:underline transition-colors"
          >
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  )
}
