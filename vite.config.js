import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
   plugins: [react()],
   resolve: {
      alias: {
         "~": path.resolve(__dirname, "./src/"),
         "~/component": path.resolve(__dirname, "./src/component/"),
         "~/pages": path.resolve(__dirname, "./src/page/"),
         "~/redux/": path.resolve(__dirname, "./src/redux/"),
         env: path.resolve(__dirname, "./src/env"),
         api: path.resolve(__dirname, "./src/service/api"),
      },
   },
});
