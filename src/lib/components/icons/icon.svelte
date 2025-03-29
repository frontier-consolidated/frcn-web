<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";

	function extractViewBox(svg: string) {
		const regex = /viewBox="([\d\- .]+)"/;
		const res = regex.exec(svg);
		if (!res) return "0 0 20 20"; // default value
		return res[1];
	}

	export type IconProps = {
		svg: string;
		viewBox?: string;
		size?: string | number;
		width?: string | number;
		height?: string | number;
		color?: string;
		stroke?: string;
		fill?: string;
		title?: string;
	} & HTMLAttributes<SVGElement>;

	let {
		svg,
		viewBox = extractViewBox(svg),
		size = "24px",
		width = size,
		height = size,
		color = "currentColor",
		stroke = "none",
		fill = color,
		title,
		...rest
	}: IconProps = $props();

	const elements = $derived(svg.replace(/<svg[ \n]([^>]*)>/, "").replace("</svg>", ""));
</script>

<svg xmlns="http://www.w3.org/2000/svg" {width} {height} {viewBox} {stroke} {fill} {...rest}>
	{#if title}
		<title>{title}</title>
	{/if}
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html elements}
</svg>
