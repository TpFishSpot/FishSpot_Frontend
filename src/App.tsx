import "./global.css"
import "./App.css"
import { AppRoutes } from "./routes/AppRoutes"
import { ThemeProvider } from "./contexts/ThemeContext"
import PWAInstallPrompt from "./components/ui/PWAInstallPrompt"

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen">
        <AppRoutes />
        <PWAInstallPrompt />
      </div>
    </ThemeProvider>
  )
}

export default App
