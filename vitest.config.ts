import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
	plugins: [react()],
	test: {
		environment: 'jsdom',
		alias: [{ find: '@', replacement: resolve(__dirname, './src') }],
		setupFiles: ['./src/tests/setup/setup-test-env.ts'],
	},
})
