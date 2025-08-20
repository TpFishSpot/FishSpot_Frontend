import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark" | "system"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  actualTheme: "light" | "dark"
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem("theme") as Theme
    return stored || "system"
  })

  const [actualTheme, setActualTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    const root = window.document.documentElement

    const updateTheme = () => {
      let newTheme: "light" | "dark"

      if (theme === "system") {
        newTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      } else {
        newTheme = theme
      }

      setActualTheme(newTheme)
      root.classList.remove("light", "dark")
      root.classList.add(newTheme)
    }

    updateTheme()
    localStorage.setItem("theme", theme)

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      mediaQuery.addEventListener("change", updateTheme)
      return () => mediaQuery.removeEventListener("change", updateTheme)
    }
  }, [theme])

  const toggleTheme = () => {
    switch (theme) {
      case "light":
        setTheme("dark")
        break
      case "dark":
        setTheme("system")
        break
      case "system":
        setTheme("light")
        break
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, actualTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
