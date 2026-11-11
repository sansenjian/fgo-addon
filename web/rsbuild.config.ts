import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    entry: { index: './src/main.tsx' },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  html: {
    title: 'Game Auto Addon',
  },
  output: {
    // GitHub Pages 项目页必须带仓库名前缀；普通部署用默认 '/'
    assetPrefix: process.env.GITHUB_PAGES === 'true' ? '/fgo-addon/' : '/',
  },
});
