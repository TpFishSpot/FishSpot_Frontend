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
            urlPattern: /^https:\/\/.*\.ngrok-free\.app\/api\/(especie|carnada|tipopesca)/i,
            handler: 'CacheFirst', 
            options: {
              cacheName: 'static-api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 8
              }
            }
          },
          {
            urlPattern: /^https:\/\/.*\.ngrok-free\.app\/api\/spot/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'spots-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 15
              }
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 30
              }
            }
          },
          {
            urlPattern: /\.(?:woff|woff2|ttf|eot)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'fonts-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365
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
            name: 'Explorar Spots',
            short_name: 'Spots',
            description: 'Buscar spots de pesca',
            url: '/spots',
            icons: [{ src: 'icons/fishing-spot-icon.png', sizes: '192x192' }]
          },
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
          },
          {
            name: 'Guía de Especies',
            short_name: 'Especies',
            description: 'Consultar especies de peces',
            url: '/especies',
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
