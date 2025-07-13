// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

// Environment variables declaration for SvelteKit
declare module '$env/static/private' {
	export const PROKERALA_CLIENT_ID: string;
	export const PROKERALA_CLIENT_SECRET: string;
}

export {};
