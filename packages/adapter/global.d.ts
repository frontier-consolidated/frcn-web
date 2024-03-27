export { }

declare global {
	const ENV_PREFIX: string;

	namespace App {
		export interface Platform {
			/**
			 * The original Node request object (https://nodejs.org/api/http.html#class-httpincomingmessage)
			 */
			req: import('http').IncomingMessage;
		}
	}
}