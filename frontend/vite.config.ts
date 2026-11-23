import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  worker: { format: 'es' },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'CodeGaon – SEE Computer Science',
        short_name: 'CodeGaon',
        description: 'Fun, animated SEE Computer Science practice for Class 10 Nepal',
        theme_color: '#16a34a',
        background_color: '#fef9c3',
        display: 'standalone',
        icons: [{ src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,wasm}'],
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
        runtimeCaching: [
          {
            // Pyodide core + packages (pandas, matplotlib…) — cache forever after first load
            urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/pyodide\/.*/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'pyodide-cache',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/(files\.pythonhosted\.org|pypi\.org)\/.*/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'pypi-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
});
