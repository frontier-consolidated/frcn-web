import { createETag } from "$lib/server/etag";

import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ url }) => {
    const xml = 
    /* xml */`
    <?xml version="1.0" encoding="UTF-8" ?>
    <urlset
        xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="https://www.w3.org/1999/xhtml"
        xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
    >
        <url>
            <loc>${url.origin}</loc>
            <changefreq>weekly</changefreq>
            <priority>0.8</priority>
        </url>
        <url>
            <loc>${url.origin}/about/community</loc>
            <changefreq>monthly</changefreq>
            <priority>0.6</priority>
        </url>
        <url>
            <loc>${url.origin}/about/org</loc>
            <changefreq>monthly</changefreq>
            <priority>0.6</priority>
        </url>
        <url>
            <loc>${url.origin}/about/activities</loc>
            <changefreq>monthly</changefreq>
            <priority>0.6</priority>
        </url>
        <url>
            <loc>${url.origin}/legal/privacy</loc>
            <changefreq>yearly</changefreq>
        </url>
        <url>
            <loc>${url.origin}/legal/cookies</loc>
            <changefreq>yearly</changefreq>
        </url>
        <url>
            <loc>${url.origin}/resources</loc>
            <changefreq>always</changefreq>
        </url>
        <url>
            <loc>${url.origin}/events</loc>
            <changefreq>always</changefreq>
        </url>
    </urlset>
    `;

    return new Response(xml.trim(), {
        headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, must-revalidate, max-age=300",
            "ETag": createETag(xml)
        }
    });
};