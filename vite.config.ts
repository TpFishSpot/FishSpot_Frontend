import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { readFileSync } from 'fs'
import { resolve } from 'path'

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
            urlPattern: /^https:\/\/192\.168\.1\.41:3000\/api\/(especie|carnada|tipopesca)/i,
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
            urlPattern: /^https:\/\/192\.168\.1\.41:3000\/api\/spot/i,
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
        'icons/fishing-spot-icon-192.png',
        'icons/fishing-spot-icon-512.png',
        'screenshots/screenshot-1.jpg',
        'screenshots/screenshot-2.jpg',
        'screenshots/screenshot-3.jpg',
        'screenshots/screenshot-wide.jpg',
        'apple-touch-icon.png',
        'masked-icon.svg'
      ],
      manifest: {
        id: '/?source=pwa',
        name: 'FishSpot - App de spots de pesca',
        short_name: 'FishSpot',
        description: 'Encuentra y comparte los mejores spots de pesca. Registra tus capturas y conecta con otros pescadores.',
        theme_color: '#0d9488',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/?source=pwa',
        scope: '/',
        categories: ['sports', 'lifestyle', 'travel'],
        lang: 'es-AR',
        dir: 'ltr',
        prefer_related_applications: false,
        icons: [
          {
            src: 'icons/fishing-spot-icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icons/fishing-spot-icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icons/fishing-spot-icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: 'icons/fishing-spot-icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
        screenshots: [
          {
            src: 'screenshots/screenshot-1.jpg',
            sizes: '942x1600',
            type: 'image/jpeg',
            form_factor: 'narrow',
            label: 'Mapa de spots de pesca'
          },
          {
            src: 'screenshots/screenshot-2.jpg',
            sizes: '942x1600',
            type: 'image/jpeg',
            form_factor: 'narrow',
            label: 'Detalle del spot'
          },
          {
            src: 'screenshots/screenshot-3.jpg',
            sizes: '942x1600',
            type: 'image/jpeg',
            form_factor: 'narrow',
            label: 'Estadísticas del spot'
          },
          {
            src: 'screenshots/screenshot-wide.jpg',
            sizes: '1920x1080',
            type: 'image/jpeg',
            form_factor: 'wide',
            label: 'Vista de escritorio'
          }
        ],
        shortcuts: [
          {
            name: 'Explorar Spots',
            short_name: 'Spots',
            description: 'Buscar spots de pesca',
            url: '/',
            icons: [{ src: 'icons/fishing-spot-icon-192.png', sizes: '192x192', type: 'image/png' }]
          },
          {
            name: 'Mis Capturas',
            short_name: 'Capturas',
            description: 'Ver mis capturas',
            url: '/mis-capturas',
            icons: [{ src: 'icons/fishing-spot-icon-192.png', sizes: '192x192', type: 'image/png' }]
          },
          {
            name: 'Nueva Captura',
            short_name: 'Capturar',
            description: 'Registrar nueva captura',
            url: '/nueva-captura',
            icons: [{ src: 'icons/fishing-spot-icon-192.png', sizes: '192x192', type: 'image/png' }]
          },
          {
            name: 'Guía de Especies',
            short_name: 'Especies',
            description: 'Consultar especies de peces',
            url: '/especies',
            icons: [{ src: 'icons/fishing-spot-icon-192.png', sizes: '192x192', type: 'image/png' }]
          }
        ]
      },
      devOptions: {
        enabled: true
      }
    })
  ],
  server: {
    port: 5173,
    host: true,
    https: {
      key: readFileSync(resolve(__dirname, 'src/cert/key.pem')),
      cert: readFileSync(resolve(__dirname, 'src/cert/cert.pem'))
    },
    cors: {
      origin: ['http://localhost:3000', 'http://localhost:5173'],
      credentials: true
    }
  }
}))
