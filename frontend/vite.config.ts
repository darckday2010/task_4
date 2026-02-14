import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react()],
	server: {
		host: true, // Слушать все интерфейсы
		port: 5173,
		watch: {
			usePolling: true, // ВКЛЮЧАЕМ ОПРОС ДЛЯ DOCKER
		},
		// Настройка HMR для корректной связи браузера с контейнером
		hmr: {
			clientPort: 5173,
		},
	},
});
