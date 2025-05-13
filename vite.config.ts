import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import reactRefresh from '@vitejs/plugin-react-refresh'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), reactRefresh()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    // This ensures that the server properly handles client-side routing
    // and prevents 404 errors when reloading pages at routes like /posts or /tags
    historyApiFallback: true,
    middlewareMode: false
  },
  preview: {
    // Also apply the same configuration for preview mode
    historyApiFallback: true,
  },
  build: {
    // Generate source maps for better debugging
    sourcemap: true,
    // Ensure proper handling of dynamic imports
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  // Explicitly set the base URL to ensure proper path resolution
  base: '/'
})
