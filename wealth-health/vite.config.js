import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',        
  build: {
    outDir: 'dist',
    sourcemap: false,
    target: 'es2018',
    assetsInlineLimit: 4096
  }
})
