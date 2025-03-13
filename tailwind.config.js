import defaultTheme from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";

function polygon(...points) {
	return `polygon(${points.join(", ")})`;
}

// TODO: Use a proper arc function https://stackoverflow.com/a/24780108
function create_smooth_corner(x, y, dx, dy, reverse = false, swap = false) {
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

const clippath_plugin = plugin(function ({ matchUtilities, theme }) {
	matchUtilities(
		{
			"clip-tr": (value) => ({
				clipPath: `${polygon(
					"0 0",
					create_smooth_corner(`100% - ${value}`, "0px", 1, 1, false, true),
					create_smooth_corner("100%", value, -1, -1, true),
					"100% 100%",
					"0 100%"
				)};`
			}),
			"clip-tl": (value) => ({
				clipPath: `${polygon(
					create_smooth_corner(value, "0px", -1, 1, true, true),
					"100% 0",
					"100% 100%",
					"0 100%",
					create_smooth_corner("0px", value, 1, -1)
				)};`
			}),
			"clip-br": (value) => ({
				clipPath: `${polygon(
					"0 0",
					"100% 0",
					create_smooth_corner("100%", `100% - ${value}`, -1, 1),
					create_smooth_corner(`100% - ${value}`, "100%", 1, -1, true, true),
					"0 100%"
				)};`
			}),
			"clip-bl": (value) => ({
				clipPath: `${polygon(
					"0 0",
					"100% 0",
					"100% 100%",
					create_smooth_corner(value, "100%", -1, -1, false, true),
					create_smooth_corner("0px", `100% - ${value}`, 1, 1, true)
				)};`
			}),
			"clip-br-parallel": (value) => ({
				clipPath: `${polygon(
					"0 0",
					"100% 0",
					create_smooth_corner("100%", `100% - ${value}`, 1, -1, false, true),
					create_smooth_corner(`100% - ${value}`, "100%", 1, -1, true, true),
					"0 100%"
				)};`
			}),
			"clip-bl-parallel": (value) => ({
				clipPath: `${polygon(
					"0 0",
					"100% 0",
					"100% 100%",
					create_smooth_corner(value, "100%", -1, -1, false, true),
					create_smooth_corner("0px", `100% - ${value}`, 1, 1, true, true)
				)};`
			}),
			"clip-r": (value) => ({
				clipPath: `${polygon(
					"0 0",
					create_smooth_corner(`100% - ${value}`, "0px", 1, 1, false, true),
					create_smooth_corner("100%", value, -1, -1, true),
					create_smooth_corner("100%", `100% - ${value}`, -1, 1),
					create_smooth_corner(`100% - ${value}`, "100%", 1, -1, true, true),
					"0 100%"
				)};`
			}),
			"clip-tl-br": (value) => ({
				clipPath: `${polygon(
					create_smooth_corner(value, "0px", -1, 1, true, true),
					"100% 0",
					create_smooth_corner("100%", `100% - ${value}`, -1, 1),
					create_smooth_corner(`100% - ${value}`, "100%", 1, -1, true, true),
					"0 100%",
					create_smooth_corner("0px", value, 1, -1)
				)};`
			})
		},
		{
			values: theme("padding"),
			type: "absolute-size"
		}
	);
});

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{html,js,svelte,ts}"],

	plugins: [clippath_plugin],

	theme: {
		extend: {
			screens: {
				xs: "420px"
			},
			colors: {
				text: {
					DEFAULT: "#FFFFFF",
					secondary: "#C0B8B8",
					tertiary: "#E4E4E4",
					muted: "#948E8E",
					destructive: "#D13333"
				},

				background: {
					DEFAULT: "#171615",
					secondary: "#292826"
				},

				card: {
					DEFAULT: "#1D1C1B"
				},

				input: {
					DEFAULT: "#0A0A0A"
				},

				border: {
					DEFAULT: "#11111080",
					solid: "#111110"
				},

				button: {
					DEFAULT: "#2DB24A",
					secondary: "#595757",
					destructive: "#D13333",
					hover: "#0000004D"
				},

				discord: "#7289DA",
				youtube: "#E52828",
				patreon: "#F2614B",
				erkul: "#ffa537",
				tradetools: "#df691a",
				cstone: "#dddddd",
				ccugame: "#ea7187",
				sc: "#00e7ff",
				scorgtools: "#8fdf14",
				hangarlink: "#97CBF8",
				verseguide: "#46A0D0"
			},
			fontFamily: {
				sans: ["Fractul", ...defaultTheme.fontFamily.sans]
			}
		}
	}
};
