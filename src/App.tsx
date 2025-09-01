import "./global.css"
import "./App.css"
import { AppRoutes } from "./routes/AppRoutes"
import { ThemeProvider } from "./contexts/ThemeContext"

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen">
        <AppRoutes />
      </div>
    </ThemeProvider>
  )
}

export default App
