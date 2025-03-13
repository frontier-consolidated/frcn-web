type ServerConfig = {
	allowed_form_routes: string[];
	sessions: {
		cookie: string;
		ttl: number;
		same_site?: boolean | "lax" | "strict" | "none";
	};
};

export const config: ServerConfig = {
	allowed_form_routes: ["/upload"],
	sessions: {
		cookie: "__frcn_sid",
		ttl: 14 * 24 * 60 * 60,
		same_site: "lax"
	}
};
