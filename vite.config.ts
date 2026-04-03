import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/robots-txt-generator/',
  plugins: [react(), tailwindcss()],
})
