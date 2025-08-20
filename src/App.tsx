import "./global.css"
import "./App.css"
import { AppRoutes } from "./routes/AppRoutes"
import { ThemeProvider } from "./contexts/ThemeContext"
import { ThemeToggle } from "./components/theme-toggle"

function App() {
  return (
    <ThemeProvider>
      <AppRoutes />
      <ThemeToggle />
    </ThemeProvider>
  )
}

export default App
