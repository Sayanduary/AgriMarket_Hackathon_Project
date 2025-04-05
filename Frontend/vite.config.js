import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  theme: {
    extend: {
      colors: {
        primary: '#ff5252'
      },
      backgroundColor:{
        primary: '#ff5252'
      },
    },
  },
  plugins: [react(),
  tailwindcss()
  ],
})
