import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import react from '@vitejs/plugin-react-swc';
import tanstackRouter from '@tanstack/router-plugin/vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const BASE_URL = env.VITE_BASE_URL || '/';
  const APP_PORT = Number(env.VITE_APP_PORT) || 5173;

  return {
    base: BASE_URL,
    server: {
      port: APP_PORT,
    },
    plugins: [
      tanstackRouter({
        target: 'react',
        autoCodeSplitting: true,
      }),
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: false,
        workbox: {
          globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
          cleanupOutdatedCaches: true,
          clientsClaim: true,
        },
        pwaAssets: {
          disabled: false,
          config: true,
        },
        manifest: {
          background_color: '#f0f0f0',
          description:
            'Project to display a Form component with multiple input field types, validations, and type-safe features.',
          dir: 'ltr',
          display: 'standalone',
          id: '/',
          name: 'DynamicForm',
          orientation: 'portrait',
          scope: '/',
          short_name: 'DynamicForm',
          start_url: '/',
          theme_color: '#f0f0f0',
          categories: ['portfolio', 'component', 'showcase', 'software', 'development'],
          shortcuts: [],
          lang: 'en',
        },
        devOptions: {
          enabled: false,
          navigateFallback: 'index.html',
          suppressWarnings: true,
          type: 'module',
        },
      }),
    ],
    resolve: {
      alias: {
        '@assets': path.resolve(__dirname, './src/assets'),
        '@components': path.resolve(__dirname, './src/components'),
        '@lib': path.resolve(__dirname, './src/lib'),
        '@services': path.resolve(__dirname, './src/services'),
        '@constants': path.resolve(__dirname, './src/constants'),
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
