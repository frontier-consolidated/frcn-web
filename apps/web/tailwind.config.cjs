/** @type {import('tailwindcss').Config}*/
const config = {
	content: [
		"./src/**/*.{html,js,svelte,ts}",
		"./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}",
	],

	plugins: [
		require("flowbite/plugin"),
	],

	darkMode: "class",

	theme: {
		extend: {
			zIndex: {
				"100": "100"
			},
			minWidth: {
				"48": "12rem"
			},
			colors: {
				// colors: https://flowbite-svelte.com/docs/pages/colors

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
				},

				erkul: {
					color: "#ffa537"
				},

				tradetools: {
					color: "#df691a"
				},

				cstone: {
					color: "#dddddd"
				},

				ccugame: {
					color: "#ea7187"
				},

				sc: {
					color: "#00e7ff"
				},

				scorgtools: {
					color: "#8fdf14"
				},

				hangarlink: {
					color: "#97CBF8"
				},

				verseguide: {
					color: "#46A0D0"
				}
			},
		},
	},
};

module.exports = config;
