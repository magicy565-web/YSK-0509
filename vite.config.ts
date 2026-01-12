import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        // --- 添加代理配置 ---
        proxy: {
          // 将所有 /api 开头的请求代理到后端服务器
          '/api': {
            target: 'http://localhost:3001', // 我们后端代理的地址
            changeOrigin: true, // 必须设置为 true，以便服务器知道来源已更改
          },
        },
      },
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
