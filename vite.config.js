import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/prg-virtue-ethics-game/',  
  plugins: [react()]
})