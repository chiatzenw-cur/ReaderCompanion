import { defineConfig } from 'vite'
import path from 'node:path'
import electron from 'vite-plugin-electron/simple'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'public/pdf.worker.min.js',
          dest: '.'
        }
      ]
    }),
    electron({
      main: {
        entry: 'electron/main.ts',
      },
      preload: {
        input: path.join(__dirname, 'electron/preload.ts'),
      },
      renderer: process.env.NODE_ENV === 'test'
        ? undefined
        : {},
    }),
  ],
  css: {
    postcss: './postcss.config.js',
  },
  optimizeDeps: {
    include: ['pdfjs-dist']
  },
  worker: {
    format: 'es'
  },
  server: {
    port: 5173,
    strictPort: true
  },
  assetsInclude: ['**/*.pdf']
})
