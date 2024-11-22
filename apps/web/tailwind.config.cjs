const plugin = require("tailwindcss/plugin");
const flattenColorPalette = require("tailwindcss/lib/util/flattenColorPalette").default;
const { parseColor } = require("tailwindcss/lib/util/color");

const fallbackFonts = [
	"ui-sans-serif",
	"system-ui",
	"-apple-system",
	"BlinkMacSystemFont",
	"sans-serif"
];

function polygon(...points) {
	return `polygon(${points.join(", ")})`;
}

// TODO: Use a proper arc function https://stackoverflow.com/a/24780108
function createSmoothCorner(x, y, dx, dy, reverse = false, swap = false) {
	// "100% calc(100% - ${value}), calc(100% - 1px) calc(100% - ${value} + 3px), calc(100% - 2px) calc(100% - ${value} + 5px), calc(100% - 3px) calc(100% - ${value} + 6px)"
	const startPoint =
		(x.match(/[-+]/) ? `calc(${x})` : x) + " " + (y.match(/[-+]/) ? `calc(${y})` : y);
	let points = [startPoint];
	for (let step = 1; step <= 3; step++) {
		let stepX = (reverse ? dy : dx) * step;
		let stepY = (reverse ? dx : dy) * (-(step ** 2) / 2 + (7 * step) / 2);

		if (swap) {
			[stepX, stepY] = [stepY, stepX];
		}

		if (stepX >= 0) stepX = `+ ${stepX}`;
		if (stepX < 0) stepX = `- ${Math.abs(stepX)}`;

		if (stepY >= 0) stepY = `+ ${stepY}`;
		if (stepY < 0) stepY = `- ${Math.abs(stepY)}`;

		points.push(`calc(${x} ${stepX}px) calc(${y} ${stepY}px)`);
	}

	if (reverse) {
		points.reverse();
	}

	return points;
}

/** @type {import('tailwindcss').Config}*/
const config = {
	content: [
		"./src/**/*.{html,js,svelte,ts}",
		"./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}"
	],

	plugins: [
		require("flowbite/plugin"),
		plugin(function ({ matchUtilities, theme }) {
			matchUtilities(
				{
					"clip-tr": (value) => ({
						clipPath: `${polygon(
							"0 0",
							createSmoothCorner(`100% - ${value}`, "0px", 1, 1, false, true),
							createSmoothCorner("100%", value, -1, -1, true),
							"100% 100%",
							"0 100%"
						)};`
					}),
					"clip-tl": (value) => ({
						clipPath: `${polygon(
							createSmoothCorner(value, "0px", -1, 1, true, true),
							"100% 0",
							"100% 100%",
							"0 100%",
							createSmoothCorner("0px", value, 1, -1)
						)};`
					}),
					"clip-br": (value) => ({
						clipPath: `${polygon(
							"0 0",
							"100% 0",
							createSmoothCorner("100%", `100% - ${value}`, -1, 1),
							createSmoothCorner(`100% - ${value}`, "100%", 1, -1, true, true),
							"0 100%"
						)};`
					}),
					"clip-bl": (value) => ({
						clipPath: `${polygon(
							"0 0",
							"100% 0",
							"100% 100%",
							createSmoothCorner(value, "100%", -1, -1, false, true),
							createSmoothCorner("0px", `100% - ${value}`, 1, 1, true)
						)};`
					}),
					"clip-br-parallel": (value) => ({
						clipPath: `${polygon(
							"0 0",
							"100% 0",
							createSmoothCorner("100%", `100% - ${value}`, 1, -1, false, true),
							createSmoothCorner(`100% - ${value}`, "100%", 1, -1, true, true),
							"0 100%"
						)};`
					}),
					"clip-bl-parallel": (value) => ({
						clipPath: `${polygon(
							"0 0",
							"100% 0",
							"100% 100%",
							createSmoothCorner(value, "100%", -1, -1, false, true),
							createSmoothCorner("0px", `100% - ${value}`, 1, 1, true, true)
						)};`
					}),
					"clip-r": (value) => ({
						clipPath: `${polygon(
							"0 0",
							createSmoothCorner(`100% - ${value}`, "0px", 1, 1, false, true),
							createSmoothCorner("100%", value, -1, -1, true),
							createSmoothCorner("100%", `100% - ${value}`, -1, 1),
							createSmoothCorner(`100% - ${value}`, "100%", 1, -1, true, true),
							"0 100%"
						)};`
					}),
					"clip-tl-br": (value) => ({
						clipPath: `${polygon(
							createSmoothCorner(value, "0px", -1, 1, true, true),
							"100% 0",
							createSmoothCorner("100%", `100% - ${value}`, -1, 1),
							createSmoothCorner(`100% - ${value}`, "100%", 1, -1, true, true),
							"0 100%",
							createSmoothCorner("0px", value, 1, -1)
						)};`
					})
				},
				{
					values: theme("padding"),
					type: "absolute-size"
				}
			);

			matchUtilities(
				{
					"box-glow": (value) => {
						const { color } = parseColor(value);
						return {
							boxShadow: `0 0 2px 0px currentColor, 0 0 6px 2px rgba(${color})`
						};
					},
					"text-glow": (value) => {
						const { color } = parseColor(value);
						return {
							textShadow: `0 0 10px 10px rgba(${color})`
						};
					}
				},
				{
					values: flattenColorPalette(theme("colors")),
					type: "color"
				}
			);
		})
	],

	darkMode: "class",

	theme: {
		fontFamily: {
			fractul: ["Fractul", ...fallbackFonts]
		},
		extend: {
			backgroundImage: {
				"triangle-pattern": "url('/triangle_pattern.svg')"
			},
			zIndex: {
				100: "100"
			},
			minWidth: {
				48: "12rem"
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
					900: "#0A3E70"
				},

				discord: {
					DEFAULT: "#5B69F0",
					pressed: "#4A55C2"
				},

				erkul: "#ffa537",
				tradetools: "#df691a",
				cstone: "#dddddd",
				ccugame: "#ea7187",
				sc: "#00e7ff",
				scorgtools: "#8fdf14",
				hangarlink: "#97CBF8",
				verseguide: "#46A0D0"
			}
		}
	}
};

module.exports = config;
