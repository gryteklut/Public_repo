import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub Pages URL: https://gryteklut.github.io/Public_repo/AB-650/
export default defineConfig({
  plugins: [react()],
  base: '/Public_repo/AB-650/',
})
