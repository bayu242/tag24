import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    fs: {
      // The shared `tag` package is linked from outside the web root.
      allow: ['..'],
    },
  },
  optimizeDeps: {
    // `tag` ships TypeScript source; let Vite transform it instead of pre-bundling.
    exclude: ['tag'],
  },
})
