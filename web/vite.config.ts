import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ command, isPreview }) => ({
  // GitHub Pages serves the project site from /tag24/. Dev uses / for a
  // simpler local URL; preview uses the same base as the build.
  base: command === 'build' || isPreview ? '/tag24/' : '/',
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
}))
