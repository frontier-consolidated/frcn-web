import rateLimit from "express-rate-limit";

export function rateLimitMiddleware() {
    const limiter = rateLimit({
        standardHeaders: true,
        legacyHeaders: true,
        
        windowMs: 60 * 1000,
        limit(req, res) {
            if (req.url === "/graphql") {
                return 100;
            }
            return 250;
        },

        
    });

    return limiter;
}