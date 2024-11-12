import react from '@vitejs/plugin-react'
import * as path from 'path'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
	// prevent vite from obscuring rust errors
	clearScreen: false,
	// Tauri expects a fixed port, fail if that port is not available
	server: {
		strictPort: true,
	},
	// to access the Tauri environment variables set by the CLI with information about the current target
	envPrefix: [
		'VITE_',
		'TAURI_PLATFORM',
		'TAURI_ARCH',
		'TAURI_FAMILY',
		'TAURI_PLATFORM_VERSION',
		'TAURI_PLATFORM_TYPE',
		'TAURI_DEBUG',
	],
	build: {
		// Tauri uses Chromium on Windows and WebKit on macOS and Linux
		target: process.env.TAURI_PLATFORM == 'windows' ? 'chrome105' : 'safari13',
		// don't minify for debug builds
		minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
		// produce sourcemaps for debug builds
		sourcemap: !!process.env.TAURI_DEBUG,
	},
	plugins: [
		react(),
		VitePWA({
			includeAssets: ['**/*.{png}', '**/*.{jpg}'],

			registerType: 'autoUpdate',
			injectRegister: false,

			pwaAssets: {
				disabled: false,
				config: true,
			},

			manifest: {
				name: 'Stone | NH',
				short_name: 'Stone | NH',
				description: 'Best card game by NH',
				theme_color: '#46B4AC',
				background_color: '#46B4AC',
				display: 'standalone',
				orientation: 'landscape-primary',
				icons: [
					{
						src: '/assets/favicons/192x192.png',
						sizes: '192x192',
						type: 'image/png',
					},
					{
						src: '/assets/favicons/512x512.png',
						sizes: '512x512',
						type: 'image/png',
					},
					{
						src: '/assets/favicons/192x192.jpg',
						sizes: '192x192',
						type: 'image/jpg',
						purpose: 'maskable',
					},
					{
						src: '/assets/favicons/512x512.jpg',
						sizes: '512x512',
						type: 'image/jpg',
						purpose: 'maskable',
					},
				],
			},

			workbox: {
				globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
				cleanupOutdatedCaches: true,
				clientsClaim: true,
			},

			devOptions: {
				enabled: true,
				navigateFallback: 'index.html',
				suppressWarnings: true,
				type: 'module',
			},
		}),
	],
	resolve: {
		alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
	},
})
