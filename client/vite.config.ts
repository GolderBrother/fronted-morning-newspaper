
import { resolve } from 'path';
import { ConfigEnv, defineConfig, UserConfigExport } from 'vite';
import vue from '@vitejs/plugin-vue'
function pathResolve(dir: string) {
  return resolve(__dirname, dir);
}

/**
 * 详细配置：https://vitejs.dev/config/
 */
 export default ({ command, mode }: ConfigEnv): UserConfigExport => {
  const alias = {
    '@': pathResolve('src'),
  };
  const proxyOptions = {
    '/api': {
      target: 'http://localhost:7001/',
      rewrite: (path) => path.replace(/^\/api/, ''),
      changeOrigin: true,
      secure: false,
      headers: {
        Referer: 'http://localhost:7001/',
      },
    },
  };
  const plugins = [vue()];
  // 具体的的配置选项：https://vitejs.dev/config/#config-file
  return defineConfig({
    resolve: {
      alias,
      extensions: ['.js', '.ts', '.vue', '.tsx', '.json'],
    },
    server: {
      proxy: proxyOptions
    },
    plugins,
    css: {
      preprocessorOptions: {
        scss: {
          // modifyVars: {
          // hack: `@import "src/assets/css/index.scss";`,
          //   // ...themeVariables,
          // },
          // additionalData: '@import "@/assets/css/index.scss";',
          // 支持内联 JavaScript
          javascriptEnabled: true,
        },
      },
    },
  });
};
