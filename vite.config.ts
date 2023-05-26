import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

import path from 'path';

/**
 * @type {import('vite').UserConfig}
 */
export default defineConfig(({ command, mode }) => {
  // 获取环境变量数据信息
  const env = loadEnv(mode, `${process.cwd()}/env`);
  // 执行页面打包入口
  const viteAppEntry = {
    index: path.resolve(__dirname, 'index.html')
  };

  return {
    root: process.cwd(),
    base: env['VITE_APP_CDN_URL'] || '/', // 接入CDN时，需要配置为CDN地址
    mode: 'development',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@root': path.resolve(__dirname),
        '@public': path.resolve(__dirname, 'public')
      }
    },
    publicDir: path.resolve(__dirname, 'public'),
    optimizeDeps: {
      esbuildOptions: {
        plugins: []
      }
    },
    css: {
      modules: {
        generateScopedName: '[local]_[hash:base64:5]'
      }
    },
    esbuild: {},
    clearScreen: true,
    // 环境变量
    envDir: path.resolve(__dirname, 'env'),
    envPrefix: 'VITE_',
    plugins: [
      vue(),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/svgs')],
        symbolId: 'icon-[dir]-[name]'
      })
    ],
    // 打包配置
    build: {
      target: 'modules',
      polyfillDynamicImport: false,
      outDir: 'dist',
      manifest: true,
      assetsDir: 'assets',
      cssCodeSplit: true,
      sourcemap: false,
      minify: 'esbuild',
      chunkSizeWarningLimit: 1024,
      emptyOutDir: true,
      rollupOptions: {
        input: viteAppEntry,
        output: {
          manualChunks(id) {
            // 抽离Node Modules中的第三方库
            if (id.includes('node_modules')) return id.toString().split('node_modules/')[1].split('/')[1].toString();
          }
        }
      },
      commonjsOptions: {
        include: [],
        transformMixedEsModules: false,
        esmExternals: false
      }
    }
  };
});
