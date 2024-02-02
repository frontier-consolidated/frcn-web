/** @type {import('tailwindcss').Config}*/
const config = {
	content: [
		"./src/**/*.{html,js,svelte,ts}",
		"./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}",
	],

	plugins: [require("flowbite/plugin")],

	darkMode: "class",

	theme: {
		extend: {
			colors: {
				// colors: https://flowbite-svelte.com/docs/pages/colors
				// primary: {
				// 	50: "#f8fafc",
				// 	100: "#f1f5f9",
				// 	200: "#e2e8f0",
				// 	300: "#cbd5e1",
				// 	400: "#94a3b8",
				// 	500: "#64748b",
				// 	600: "#475569",
				// 	700: "#334155",
				// 	800: "#1e293b",
				// 	900: "#0f172a",
				// },

				primary: {
					50: "#EAF4FF",
					100: "#C3DDF7",
					200: "#A5CAEF",
					300: "#8BBDEF",
					400: "#5BA5EF",
					500: "#3492EF",
					600: "#1784F2",
					700: "#1471CE",
					800: "#105396",
					900: "#0A3E70",
				},

				discord: {
					200: "#97a9e8",
					500: "#7289da",
				}
			},
		},
	},
};

module.exports = config;
