import node from "@astrojs/node";
import react from "@astrojs/react";
import auditLog from "@emdash-cms/plugin-audit-log";
import { defineConfig, fontProviders, passthroughImageService } from "astro/config";
import emdash, { local } from "emdash/astro";
import { sqlite } from "emdash/db";

const siteUrl =
	process.env.EMDASH_SITE_URL ||
	process.env.SITE_URL ||
	(import.meta.env.DEV ? "http://localhost:4321" : "http://127.0.0.1:4321");

const siteHost = (() => {
	try {
		return new URL(siteUrl).hostname;
	} catch {
		return "localhost";
	}
})();

export default defineConfig({
	site: siteUrl,
	output: "server",
	security: {
		allowedDomains: [{ hostname: siteHost, protocol: "https" }, { hostname: "localhost", protocol: "http" }],
	},
	adapter: node({
		mode: "standalone",
	}),
	image: {
		service: passthroughImageService(),
		layout: "constrained",
		responsiveStyles: true,
	},
	integrations: [
		react(),
		emdash({
			siteUrl,
			database: sqlite({ url: "file:./data.db" }),
			storage: local({
				directory: "./uploads",
				baseUrl: "/_emdash/api/media/file",
			}),
			plugins: [auditLog],
		}),
	],
	fonts: [
		{
			provider: fontProviders.google(),
			name: "Inter",
			cssVariable: "--font-body",
			weights: [400, 500, 600, 700],
			fallbacks: ["sans-serif"],
		},
		{
			provider: fontProviders.google(),
			name: "JetBrains Mono",
			cssVariable: "--font-mono",
			weights: [400, 500],
			fallbacks: ["monospace"],
		},
	],
	devToolbar: { enabled: false },
});
