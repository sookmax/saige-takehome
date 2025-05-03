/// <reference types="vitest" />
/// <reference types="@vitest/browser/providers/playwright" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // shadcn/ui
  // https://ui.shadcn.com/docs/installation/vite#update-viteconfigts
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    workspace: [
      {
        extends: true,
        test: {
          include: ['tests/**/*.node.test.ts'],
          name: 'node',
          environment: 'node',
        },
      },
      {
        extends: true,
        test: {
          include: ['tests/**/*.browser.test.{ts,tsx}'],
          setupFiles: ['./vitest.browser.setup.ts'],
          name: 'browser',
          browser: {
            enabled: true,
            provider: 'playwright',
            instances: [{ browser: 'chromium' }],
            viewport: {
              width: 1280,
              height: 720,
            },
          },
        },
      },
    ],
  },
})
