// Script to copy PDF.js worker to public directory
import { copyFileSync, existsSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const srcPath = join(__dirname, 'node_modules', 'pdfjs-dist', 'build', 'pdf.worker.min.mjs')
const destDir = join(__dirname, 'public')
const destPath = join(destDir, 'pdf.worker.min.js')

// Ensure public directory exists
if (!existsSync(destDir)) {
  mkdirSync(destDir, { recursive: true })
}

// Copy worker file
if (existsSync(srcPath)) {
  copyFileSync(srcPath, destPath)
  console.log('PDF.js worker copied to public directory')
} else {
  console.error('PDF.js worker not found in node_modules')
  console.log('Looking for:', srcPath)
}