import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // During `npm run dev`, proxy /api/duo-streak to Duolingo directly
      // (server-side, so no CORS restriction)
      '/api/duo-streak': {
        target: 'https://www.duolingo.com',
        changeOrigin: true,
        secure: true,
        rewrite: () =>
          '/2017-06-30/users?username=aswin.rar&fields=streak,learningLanguage',
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader(
              'User-Agent',
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
            )
            proxyReq.setHeader('Accept', 'application/json')
          })
        },
      },
    },
  },
})
