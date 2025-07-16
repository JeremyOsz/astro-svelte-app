import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [tailwindcss() as any, sveltekit()],
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					d3: ['d3'],
					vendor: ['luxon']
				}
			}
		}
	}
});
