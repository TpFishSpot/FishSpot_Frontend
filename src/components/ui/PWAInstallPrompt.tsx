import React, { useState, useEffect } from 'react'
import { Download, X, Smartphone, Share } from 'lucide-react'
import { usePWA } from '../../hooks/ui/usePWA'
import { useIsMobile } from '../../hooks/useIsMobile'

const PWAInstallPrompt: React.FC = () => {
  const { isInstalled, isStandalone, isIOS, installApp, getInstallInstructions, canInstall } = usePWA()
  const [showPrompt, setShowPrompt] = useState(true)
  const [showInstructions, setShowInstructions] = useState(false)
  const isMobile = useIsMobile()

  
  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-install-dismissed')
    if (dismissed) {
      const dismissedTime = parseInt(dismissed)
      const now = Date.now()
      const twentyFourHours = 24 * 60 * 60 * 1000

      if (now - dismissedTime < twentyFourHours) {
        setShowPrompt(false)
      } else {
        localStorage.removeItem('pwa-install-dismissed')
      }
    }
  }, [])

 
  if (isInstalled || isStandalone || !canInstall || !showPrompt) {
    return null
  }

  const handleInstall = async () => {
    if (isIOS) {
      setShowInstructions(true)
    } else {
      const success = await installApp()
      if (success) {
        setShowPrompt(false)
      }
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('pwa-install-dismissed', Date.now().toString())
  }

  if (showInstructions) {
    const instructions = getInstallInstructions()

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-card border border-border rounded-xl shadow-xl max-w-md w-full">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center space-x-2">
              <Smartphone className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">{instructions.title}</h3>
            </div>
            <button
              onClick={() => setShowInstructions(false)}
              className="p-1 hover:bg-muted rounded"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          <div className="p-4">
            <div className="space-y-3">
              {instructions.steps.map((step, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{step}</p>
                </div>
              ))}
            </div>

            {isIOS && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
                  <Share className="w-4 h-4" />
                  <span className="text-sm font-medium">Busca el botón de compartir en Safari</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="fixed left-4 right-4 z-50 pwa-install-prompt"
      style={
        isMobile
          ? { bottom: 'max(88px, calc(88px + env(safe-area-inset-bottom)))' }
          : { bottom: '1rem' }
      }
    >
      <div className="bg-card border border-border rounded-lg shadow-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
              <Download className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-foreground text-sm">Instalar FishSpot</h4>
              <p className="text-xs text-muted-foreground">
                Agrega la app a tu pantalla de inicio para acceso rápido
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              onClick={handleDismiss}
              className="px-3 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Ahora no
            </button>
            <button
              onClick={handleInstall}
              className="px-4 py-2 bg-primary text-primary-foreground text-xs font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              Instalar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PWAInstallPrompt