import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from "path";
import tailwindcss from  "tailwindcss"
import autoprefixer from "autoprefixer"

// https://vitejs.dev/config/
export default (props: any) => {
  const { mode } = props;
  return defineConfig({
    // build: {
    //   sourcemap: true,
    // },
    base: loadEnv(mode, process.cwd()).VITE_APP_BASE_URL,
    plugins: [react()],
    css: {
      postcss: {
        plugins: [
          tailwindcss, 
          autoprefixer,
        ]
      }
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, './src') // 路径别名
      },
    },
    server: {
      host: "127.0.0.1",
      port: Number(loadEnv(mode, process.cwd()).VITE_APP_PORT),
      // https: true,
      // strictPort: true, // 端口被占用直接退出
      open: true, // 在开发服务器启动时自动在浏览器中打开应用程序
      proxy: {
        // 字符串简写写法
        "^/api": {
          target:
            mode === "development"
              ? loadEnv(mode, process.cwd()).VITE_APP_DEV_URL
              : loadEnv(mode, process.cwd()).VITE_APP_PROD_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
      hmr: {
        overlay: false, // 屏蔽服务器报错
      },
    },
  })
}
