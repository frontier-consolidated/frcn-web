import { createRouteHandler } from "uploadthing/server";

import { building } from "$app/environment";
import { env } from "$env/dynamic/private";
import { config } from "$lib/config";
import { uploads_router } from "$server/uploads";

const UPLOADTHING_TOKEN = building ? process.env.UPLOADTHING_TOKEN : env.UPLOADTHING_TOKEN;

const handlers = createRouteHandler({
	router: uploads_router,
	config: {
		token: UPLOADTHING_TOKEN,
		callbackUrl: `https://${config.domain}/upload`
	}
});

export { handlers as GET, handlers as POST };
