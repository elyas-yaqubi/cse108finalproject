import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    proxy: {
      '/getInfo': 'http://localhost:5000',
      '/getPosts': 'http://localhost:5000',
      '/getRandomPosts': 'http://localhost:5000',
      '/toggleLikes': 'http://localhost:5000',
      '/register': 'http://localhost:5000',
      '/unfollow': 'http://localhost:5000',
      '/follow': 'http://localhost:5000',
      '/updateBio': 'http://localhost:5000',
      '/uploadProfilePicture': 'http://localhost:5000',
      '/login': 'http://localhost:5000',
      '/upload': 'http://localhost:5000',
      '/check-auth': 'http://localhost:5000',
      '/logout': 'http://localhost:5000',
      '/searchUsers': 'http://localhost:5000',
    }
  },
  build: {
    outDir: 'dist'
  }
})
