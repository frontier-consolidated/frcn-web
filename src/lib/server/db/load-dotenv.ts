import * as dotenv from "dotenv";

import { dev } from "$app/environment";

if (dev) {
	dotenv.config();
}
