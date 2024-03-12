const plugin = require("tailwindcss/plugin")
const flattenColorPalette = require("tailwindcss/lib/util/flattenColorPalette").default
const { parseColor } = require("tailwindcss/lib/util/color")

/** @type {import('tailwindcss').Config}*/
const config = {
	content: [
		"./src/**/*.{html,js,svelte,ts}",
		"./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}",
	],

	plugins: [
		require("flowbite/plugin"),
		plugin(function ({ matchUtilities, theme }) {
			matchUtilities({
				"clip-tr": (value) => ({
					clipPath: `polygon(0 0, calc(100% - ${value}) 0, 100% ${value}, 100% 100%, 0 100%);`
				}),
				"clip-tl": (value) => ({
					clipPath: `polygon(${value} 0, 100% 0, 100% 100%, 0 100%, 0 ${value});`
				}),
				"clip-br": (value) => ({
					clipPath: `polygon(0 0, 100% 0, 100% calc(100% - ${value}), calc(100% - ${value}) 100%, 0 100%);`
				}),
				"clip-bl": (value) => ({
					clipPath: `polygon(0 0, 100% 0, 100% 100%, ${value} 100%, 0 calc(100% - ${value}));`
				}),
				"clip-r": (value) => ({
					clipPath: `polygon(0 0, calc(100% - ${value}) 0, 100% ${value}, 100% calc(100% - ${value}), calc(100% - ${value}) 100%, 0 100%);`
				}),
				"clip-opposite": (value) => ({
					clipPath: `polygon(${value} 0, 100% 0, 100% calc(100% - ${value}), calc(100% - ${value}) 100%, 0 100%, 0 ${value});`
				}),
				"clip-opposite-reverse": (value) => ({
					clipPath: `polygon(0 0, calc(100% - ${value}) 0, 100% ${value}, 100% 100%, ${value} 100%, 0 calc(100% - ${value}));`
				}),
			}, {
				values: theme("padding"),
				type: "absolute-size"
			})

			matchUtilities({
				"box-glow": (value) => {
					const { color } = parseColor(value)
					return {
						boxShadow: `0 0 2px 0px currentColor, 0 0 6px 2px rgba(${color})`
					}
				},
				"text-glow": (value) => {
					const { color } = parseColor(value)
					return {
						textShadow: `0 0 10px 10px rgba(${color})`
					}
				}
			}, {
				values: flattenColorPalette(theme("colors")),
				type: "color"
			})
		})
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
