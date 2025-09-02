import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx'
import './global.css'
import { registerSW } from 'virtual:pwa-register'

// Registro mejorado del Service Worker
registerSW({
  onNeedRefresh() {
    // Crear notificación personalizada para actualizaciones
    const updateNotification = document.createElement('div')
    updateNotification.innerHTML = `
      <div style="position: fixed; top: 16px; right: 16px; z-index: 9999; background: white; border: 1px solid #0d9488; border-radius: 8px; padding: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); max-width: 320px;">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
          <div style="width: 8px; height: 8px; background: #0d9488; border-radius: 50%;"></div>
          <strong style="color: #0d9488;">Nueva versión disponible</strong>
        </div>
        <p style="margin: 0 0 12px 0; color: #4b5563; font-size: 14px;">
          Hay mejoras y correcciones disponibles
        </p>
        <div style="display: flex; gap: 8px; justify-content: flex-end;">
          <button onclick="this.parentElement.parentElement.parentElement.remove()" style="padding: 6px 12px; border: 1px solid #d1d5db; background: white; border-radius: 4px; font-size: 12px; cursor: pointer;">
            Después
          </button>
          <button onclick="window.location.reload()" style="padding: 6px 12px; background: #0d9488; color: white; border: none; border-radius: 4px; font-size: 12px; cursor: pointer;">
            Actualizar
          </button>
        </div>
      </div>
    `
    document.body.appendChild(updateNotification)
  },
  onOfflineReady() {
    // Mostrar notificación de que la app funciona offline
    const offlineNotification = document.createElement('div')
    offlineNotification.innerHTML = `
      <div style="position: fixed; bottom: 16px; left: 16px; right: 16px; z-index: 9999; background: #059669; color: white; border-radius: 8px; padding: 12px 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); text-align: center;">
        <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
          <span style="font-size: 16px;">🚀</span>
          <span style="font-size: 14px; font-weight: 500;">¡App lista para usar sin conexión!</span>
        </div>
      </div>
    `
    document.body.appendChild(offlineNotification)
    
    // Remover la notificación después de 3 segundos
    setTimeout(() => {
      offlineNotification.remove()
    }, 3000)
    
    console.log("La app ya funciona offline 🚀")
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
