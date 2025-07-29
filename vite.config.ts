import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [tailwindcss() as any, sveltekit()],
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					'ui': ['@lucide/svelte', 'lucide-svelte']
				}
			}
		},
		chunkSizeWarningLimit: 1000
	},
	optimizeDeps: {
		include: ['d3', '@lucide/svelte', 'lucide-svelte']
	}
});
