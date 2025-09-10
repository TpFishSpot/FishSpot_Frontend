import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: mode === 'development' 
          ? ['**/*.{js,css,html}'] 
          : ['**/*.{js,css,html,ico,png,svg,woff2}'],
        skipWaiting: false,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.ngrok-free\.app\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              }
            }
          }
        ]
      },
      includeAssets: [
        'favicon.ico',
        'icons/fishing-spot-icon.png',
        'apple-touch-icon.png',
        'masked-icon.svg'
      ],
      manifest: {
        name: 'FishSpot - App de spots de pesca',
        short_name: 'FishSpot',
        description: 'App de spots de pesca para encontrar y compartir los mejores lugares',
        theme_color: '#0d9488',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/',
        scope: '/',
        id: '/',
        icons: [
          {
            src: 'icons/fishing-spot-icon.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icons/fishing-spot-icon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icons/fishing-spot-icon.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: 'icons/fishing-spot-icon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
        categories: ['sports', 'lifestyle', 'entertainment'],
        lang: 'es-AR',
        dir: 'ltr',
        prefer_related_applications: false,
        shortcuts: [
          {
            name: 'Mis Capturas',
            short_name: 'Capturas',
            description: 'Ver mis capturas',
            url: '/mis-capturas',
            icons: [{ src: 'icons/fishing-spot-icon.png', sizes: '192x192' }]
          },
          {
            name: 'Nueva Captura',
            short_name: 'Capturar',
            description: 'Registrar nueva captura',
            url: '/nueva-captura',
            icons: [{ src: 'icons/fishing-spot-icon.png', sizes: '192x192' }]
          }
        ],
        screenshots: [],
        related_applications: []
      },
      devOptions: {
        enabled: false
      }
    })
  ],
  server: {
    port: 5173,
    host: true,
    cors: {
      origin: ['http://localhost:3000', 'http://localhost:5173'],
      credentials: true
    }
  }
}))
