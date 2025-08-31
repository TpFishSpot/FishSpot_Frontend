import "./global.css"
import "./App.css"
import { AppRoutes } from "./routes/AppRoutes"
import { ThemeProvider } from "./contexts/ThemeContext"
import { ThemeToggle } from "./components/theme-toggle"

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen">
        <AppRoutes />
        <ThemeToggle />
      </div>
    </ThemeProvider>
  )
}

export default App
