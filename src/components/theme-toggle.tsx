import { useTheme } from "../contexts/ThemeContext"

export function ThemeToggle() {
  const { theme, toggleTheme} = useTheme()

  const getIcon = () => {
    switch (theme) {
      case "light":
        return "☀️"
      case "dark":
        return "🌙"
      case "system":
        return "💻"
    }
  }

  const getLabel = () => {
    switch (theme) {
      case "light":
        return "Modo Claro"
      case "dark":
        return "Modo Oscuro"
      case "system":
        return "Sistema"
    }
  }

  return (
    <button
      onClick={toggleTheme}   
      className="fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg shadow-lg hover:bg-accent transition-colors"
      title={`Cambiar tema - Actual: ${getLabel()}`}
    >
      <span className="text-lg">{getIcon()}</span>
      <span className="text-sm font-medium text-foreground hidden sm:block">{getLabel()}</span>
    </button>
  )
}
