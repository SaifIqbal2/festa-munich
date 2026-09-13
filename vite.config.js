import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
       strategies: 'generateSW',
      srcDir: 'src',
      filename: 'service-worker.js',
      manifest: {
        name: 'Festa Munich - Wholesale B2B Leather & Bespoke Atelier',
        short_name: 'Festa Munich',
        description: 'Global B2B wholesale leather jackets and bespoke atelier manufacturing from Sialkot. Request quotations and explore our garment catalog.',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
        categories: ['shopping', 'fashion'],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
        },
      },
    },
    target: 'esnext',
    minify: 'terser',
  },
  server: {
    port: 5173,
    open: false,
    historyApiFallback: true,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'zustand'],
  },
});
