import "./global.css"
import "./App.css"
import { AppRoutes } from "./routes/AppRoutes"
import { ThemeProvider } from "./contexts/ThemeContext"
import PWAInstallPrompt from "./components/ui/PWAInstallPrompt"
import { useIOSSwipeBack } from "./hooks/useIOSSwipeBack"

function App() {
  useIOSSwipeBack();

  return (
    <ThemeProvider>
      <div className="min-h-screen safe-area-inset-top">
        <AppRoutes />
        <PWAInstallPrompt />
      </div>
    </ThemeProvider>
  )
}

export default App
