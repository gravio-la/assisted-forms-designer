import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  // Wrap with slashes so Vite gets the correct sub-path for GitHub Pages.
  base: process.env.VITE_BASE_PATH ? `/${process.env.VITE_BASE_PATH}/` : '/',
  /**
   * - React / react-i18next: workspace packages can pull a second copy; hooks break.
   * - @graviola/agent-chat-components: flow@0.1.3 may nest components@0.1.0 without WandHutFabIcon;
   *   force a single hoisted 0.1.1 (see root package.json overrides).
   */
  resolve: {
    dedupe: ['react', 'react-dom', '@graviola/agent-chat-components'],
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'i18next',
      'react-i18next',
    ],
  },
  plugins: [
    react(),
    // Generate multiple visualization files
    visualizer({
      filename: './dist/analysis/flamegraph.html',
      template: 'sunburst', // This generates the flamegraph-style visualization
      title: 'Bundle Flamegraph',
    }),
    visualizer({
      filename: './dist/analysis/network.html',
      template: 'network',
      title: 'Bundle Network',
    }),
    visualizer({
      filename: './dist/analysis/sunburst.html',
      template: 'sunburst',
      title: 'Bundle Sunburst',
    }),
    visualizer({
      filename: './dist/analysis/treemap.html',
      template: 'treemap',
      title: 'Bundle Treemap',
    }),
  ],
})