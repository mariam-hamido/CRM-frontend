import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
const alias = {
  '@/app': path.resolve(import.meta.dirname, './src/app'),
  '@/assets': path.resolve(import.meta.dirname, './src/assets'),
  '@/components': path.resolve(import.meta.dirname, './src/components'),
  '@/constants': path.resolve(import.meta.dirname, './src/constants'),
  '@/features': path.resolve(import.meta.dirname, './src/features'),
  '@/hooks': path.resolve(import.meta.dirname, './src/hooks'),
  '@/layouts': path.resolve(import.meta.dirname, './src/layouts'),
  '@/lib': path.resolve(import.meta.dirname, './src/lib'),
  '@/routes': path.resolve(import.meta.dirname, './src/routes'),
  '@/services': path.resolve(import.meta.dirname, './src/services'),
  '@/store': path.resolve(import.meta.dirname, './src/store'),
  '@/styles': path.resolve(import.meta.dirname, './src/styles'),
  '@/types': path.resolve(import.meta.dirname, './src/types'),
  '@/utils': path.resolve(import.meta.dirname, './src/utils'),
  '@': path.resolve(import.meta.dirname, './src'),
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias,
  },
})
