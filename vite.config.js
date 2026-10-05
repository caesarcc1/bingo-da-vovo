import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import legacy from '@vitejs/plugin-legacy'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    legacy({
      targets: ['chrome >= 80', 'android >= 4.4'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
      renderLegacyChunks: true
    })
  ],
  build: {
    target: ['es2018', 'chrome80'],
    cssMinify: 'lightningcss'
  },
  css: {
    transformer: 'lightningcss',
    lightningcss: {
      targets: {
        chrome: 80 << 16
      }
    }
  }
})
