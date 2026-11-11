import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Relative base works with HashRouter on GitHub Pages and local Vite.
export default defineConfig({
  plugins: [react()],
  base: './',
})
