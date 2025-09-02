import { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export const usePWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Detectar si es iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(iOS)

    // Detectar si ya está instalado
    const standalone = window.matchMedia('(display-mode: standalone)').matches
    const fullscreen = window.matchMedia('(display-mode: fullscreen)').matches
    const minimalUi = window.matchMedia('(display-mode: minimal-ui)').matches
    
    setIsStandalone(standalone || fullscreen || minimalUi)
    setIsInstalled(standalone || fullscreen || minimalUi || (navigator as any).standalone)

    // Listener para el evento de instalación (Android/Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setIsInstallable(true)
    }

    // Listener para cuando la app es instalada
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setIsInstallable(false)
      setDeferredPrompt(null)
      console.log('PWA fue instalada exitosamente')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const installApp = async () => {
    if (!deferredPrompt) return false

    try {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        setDeferredPrompt(null)
        setIsInstallable(false)
        return true
      }
      return false
    } catch (error) {
      console.error('Error al instalar la PWA:', error)
      return false
    }
  }

  const getInstallInstructions = () => {
    if (isIOS) {
      return {
        title: 'Instalar FishSpot',
        steps: [
          'Toca el botón "Compartir" ⬆️ en la barra inferior',
          'Desplázate hacia abajo y toca "Añadir a la pantalla de inicio"',
          'Toca "Añadir" en la esquina superior derecha'
        ]
      }
    } else {
      return {
        title: 'Instalar FishSpot',
        steps: [
          'Toca el menú del navegador (⋮)',
          'Selecciona "Añadir a la pantalla de inicio"',
          'Toca "Añadir" para instalar la app'
        ]
      }
    }
  }

  return {
    isInstallable,
    isInstalled,
    isStandalone,
    isIOS,
    installApp,
    getInstallInstructions,
    canInstall: deferredPrompt !== null || isIOS
  }
}
