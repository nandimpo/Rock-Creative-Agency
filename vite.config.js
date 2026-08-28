import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/Rock-Creative-Agency/',
  build: {
    outDir: 'docs',
  },
  plugins: [
    react(),
    {
      name: 'base-public-image-paths',
      transform(code, id) {
        if (!/\.[jt]sx?$/.test(id)) return null;
        return code.replaceAll('/Images/', '/Rock-Creative-Agency/Images/');
      },
    },
  ],
})
