/**
 * CreatorsMantra Frontend - Vite Configuration
 * Optimized build configuration for production-ready React application
 * 
 * @author CreatorsMantra Team
 * @version 1.0.0
 * @file vite.config.js
 * 
 * Frontend: http://localhost:5173
 * Backend:  http://localhost:3000
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable React Fast Refresh
      fastRefresh: true,
      // Include .jsx files
      include: "**/*.{jsx,js}",
    })
  ],
  
  // Path resolution for clean imports
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@modules': path.resolve(__dirname, './src/modules'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@layout': path.resolve(__dirname, './src/layout'),
      '@router': path.resolve(__dirname, './src/router'),
      '@assets': path.resolve(__dirname, './public/assets'),
      
      // Module-specific aliases for easier imports
      '@auth': path.resolve(__dirname, './src/modules/auth'),
      '@deals': path.resolve(__dirname, './src/modules/deals'),
      '@invoices': path.resolve(__dirname, './src/modules/invoices'),
      '@analytics': path.resolve(__dirname, './src/modules/analytics'),
      '@briefs': path.resolve(__dirname, './src/modules/briefs'),
      '@performance': path.resolve(__dirname, './src/modules/performance'),
      '@ratecard': path.resolve(__dirname, './src/modules/ratecard'),
    }
  },
  
  // Development server configuration
  server: {
    port: 5173,                    // 🔄 CHANGED: Frontend on port 5173
    host: true,                    // Allow external connections
    open: true,                    // Auto-open browser
    cors: true,
    
    // Proxy API calls to backend on port 3000
    proxy: {
      '/api': {
        target: 'http://localhost:3000',    // 🔄 CHANGED: Backend on port 3000
        changeOrigin: true,
        secure: false,
        rewrite: (path) => {
          console.log(`🔄 Proxying API request: ${path} -> http://localhost:3000${path}`);
          return path;
        }
      }
    }
  },
  
  // Build configuration for production
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser',
    
    // Chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-redux': ['@reduxjs/toolkit', 'react-redux'],
          'vendor-ui': ['framer-motion', 'react-hook-form', 'react-hot-toast'],
          'vendor-charts': ['chart.js', 'react-chartjs-2', 'recharts'],
          'vendor-utils': ['axios', 'date-fns', 'lodash', 'yup'],
          
          // Module chunks (lazy loading)
          'module-deals': ['./src/modules/deals'],
          'module-invoices': ['./src/modules/invoices'],
          'module-analytics': ['./src/modules/analytics'],
          'module-briefs': ['./src/modules/briefs'],
          'module-performance': ['./src/modules/performance'],
        },
        
        // Clean file names
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      }
    },
    
    // Optimize bundle size
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
      }
    },
    
    // Asset optimization
    assetsInlineLimit: 4096, // 4kb limit for inlining assets
  },
  
  // Environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
  
  // CSS configuration
  css: {
    devSourcemap: true,
    modules: {
      // CSS Modules configuration
      localsConvention: 'camelCase',
      generateScopedName: '[name]__[local]___[hash:base64:5]'
    },
    preprocessorOptions: {
      // If we add SCSS later
      scss: {
        additionalData: `@import "@shared/styles/variables.css";`
      }
    }
  },
  
  // Optimization
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@reduxjs/toolkit',
      'react-redux',
      'axios',
      'framer-motion',
      'react-hook-form',
      'chart.js',
      'react-chartjs-2'
    ],
    exclude: ['@testing-library/react']
  },
  
  // Test configuration
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    css: true,
  }
})