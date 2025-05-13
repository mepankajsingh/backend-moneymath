import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    // This ensures that the server properly handles client-side routing
    // and prevents 404 errors when reloading pages at routes like /posts or /tags
    historyApiFallback: true,
  },
  preview: {
    // Also apply the same configuration for preview mode
    historyApiFallback: true,
  },
})
