import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // redux
          'store-vendor': ['redux', 'react-redux'],
          // 将工具库分组
          'utils-vendor': ['axios'],
          // RTC
          'rtc-vendor': ['@volcengine/rtc'],
          // 按路由拆分（如果使用React Router）
          // ...其他自定义分组
        }
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8888/api/v1/usr/',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
