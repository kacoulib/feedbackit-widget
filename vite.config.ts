import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'packages/react/src/index.tsx',
      name: 'FeedbackItWidget',
      fileName: (format) => `feedbackit-widget.${format}.js`
    },
    rollupOptions: {
      external: ['react', 'react-dom']
    },
    outDir: 'packages/react/dist'
  }
});
