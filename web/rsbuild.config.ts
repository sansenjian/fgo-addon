import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact()],
  source: {
    entry: { index: './src/main.tsx' },
    // rsbuild 不会自动把 shell 环境变量塞进 import.meta.env，必须显式 define
    define: {
      'import.meta.env.VITE_API_BASE': JSON.stringify(process.env.VITE_API_BASE ?? ''),
      'import.meta.env.VITE_DEMO_MODE': JSON.stringify(process.env.VITE_DEMO_MODE ?? ''),
    },
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
