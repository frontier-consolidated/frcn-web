<script lang="ts">
	import { twMerge } from "tailwind-merge";

	type CornerSize = "none" | "small" | "large";
	// type CornerType = CornerSize | `i${CornerSize}`;
	export type CornersConfig = CornerSize | Exclude<`${CornerSize} ${CornerSize}`, "none none">;

	let {
		bg = "white",
		border = "transparent",
		corners = "none",
		class: className
	}: {
		bg?: string;
		border?: string;
		corners?: CornersConfig;
		class?: string;
	} = $props();

	const topLeft = $derived(
		!corners?.includes(" ") ? corners : corners?.split(" ")[0]
	) as CornerSize;
	const bottomRight = $derived(
		!corners?.includes(" ") ? corners : corners?.split(" ")[1]
	) as CornerSize;
</script>

<div
	aria-hidden="true"
	style="--s-bg:{bg.startsWith('--') ? `var(${bg})` : bg};--s-border:{border.startsWith('--')
		? `var(${border})`
		: border};"
	class={twMerge(
		"grid grid-rows-[1fr] border-(--s-border) fill-(--s-bg) stroke-0",
		topLeft !== "none" || bottomRight !== "none" ? "grid-cols-2" : "grid-cols-1",
		className
	)}
>
	{#if topLeft !== "none"}
		<div
			class={twMerge(
				"grid border-inherit",
				topLeft === "small"
					? "grid-cols-[20px_minmax(3px,1fr)] grid-rows-[20px_minmax(3px,1fr)]"
					: "grid-cols-[30px_minmax(3px,1fr)] grid-rows-[30px_minmax(3px,1fr)]"
			)}
		>
			<div class="relative">
				{#if topLeft === "small"}
					<svg
						class="absolute top-0 left-0 h-full w-full"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M12.2426 1.75736L1.75736 12.2426C0.632141 13.3679 0 14.894 0 16.4853V20H20V0H16.4853C14.894 0 13.3679 0.632139 12.2426 1.75736Z"
						/>
					</svg>
					<svg
						class="absolute top-0 left-0 h-full w-full fill-(--s-border)"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M12.2426 1.75736L1.75736 12.2426C0.632141 13.3679 0 14.894 0 16.4853V20H1V16.9853C1 15.394 1.63214 13.8679 2.75736 12.7426L12.7426 2.75736C13.8679 1.63214 15.394 1 16.9853 1H20V0H16.4853C14.894 0 13.3679 0.632139 12.2426 1.75736Z"
						/>
					</svg>
				{:else if topLeft === "large"}
					<svg
						class="absolute top-0 left-0 h-full w-full"
						viewBox="0 0 30 30"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M22.2426 1.75736L1.75736 22.2426C0.632141 23.3679 0 24.894 0 26.4853V30H30V0H26.4853C24.894 0 23.3679 0.632141 22.2426 1.75736Z"
						/>
					</svg>
					<svg
						class="absolute top-0 left-0 h-full w-full fill-(--s-border)"
						viewBox="0 0 30 30"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M22.2426 1.75736L1.75736 22.2426C0.632141 23.3679 0 24.894 0 26.4853V30H1V26.9853C1 25.394 1.63214 23.8679 2.75736 22.7426L22.7426 2.75736C23.8679 1.63214 25.394 1 26.9853 1H30V0H26.4853C24.894 0 23.3679 0.632141 22.2426 1.75736Z"
						/>
					</svg>
				{/if}
			</div>
			<div class="border-t-1 border-inherit bg-(--s-bg)"></div>
			<div
				class="col-span-2 rounded-bl-[3px] border-b-1 border-l-1 border-inherit bg-(--s-bg)"
			></div>
		</div>
	{/if}
	{#if topLeft === "none" || bottomRight === "none"}
		<div
			class={twMerge(
				"border-t-1 border-b-1 border-inherit bg-(--s-bg)",
				topLeft === "none" && "rounded-l-[3px] border-l-1",
				bottomRight === "none" && "rounded-r-[3px] border-r-1"
			)}
		></div>
	{/if}
	{#if bottomRight !== "none"}
		<div
			class={twMerge(
				"grid border-inherit",
				bottomRight === "small"
					? "grid-cols-[minmax(3px,1fr)_20px] grid-rows-[minmax(3px,1fr)_20px]"
					: "grid-cols-[minmax(3px,1fr)_30px] grid-rows-[minmax(3px,1fr)_30px]"
			)}
		>
			<div
				class="col-span-2 rounded-tr-[3px] border-t-1 border-r-1 border-inherit bg-(--s-bg)"
			></div>
			<div class="border-b-1 border-inherit bg-(--s-bg)"></div>
			<div class="relative">
				{#if bottomRight === "small"}
					<svg
						class="absolute top-0 left-0 h-full w-full"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M18.2429 7.75736L7.75757 18.2426C6.63235 19.3679 5.10623 20 3.51493 20H0V0H20.0002V3.51472C20.0002 5.10602 19.3681 6.63214 18.2429 7.75736Z"
						/>
					</svg>
					<svg
						class="absolute top-0 left-0 h-full w-full fill-(--s-border)"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M18.2429 7.75736L7.75757 18.2426C6.63235 19.3679 5.10623 20 3.51493 20H0V19H3.01472C4.60602 19 6.13214 18.3679 7.25736 17.2426L17.2426 7.25736C18.3679 6.13214 19 4.60602 19 3.01472V0H20.0002V3.51472C20.0002 5.10602 19.3681 6.63214 18.2429 7.75736Z"
						/>
					</svg>
				{:else if bottomRight === "large"}
					<svg
						class="absolute top-0 left-0 h-full w-full"
						viewBox="0 0 30 30"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M28.2426 7.75736L7.75736 28.2426C6.63214 29.3679 5.10602 30 3.51472 30H0V0H30V3.51472C30 5.10602 29.3679 6.63214 28.2426 7.75736Z"
						/>
					</svg>
					<svg
						class="absolute top-0 left-0 h-full w-full fill-(--s-border)"
						viewBox="0 0 30 30"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M28.2426 7.75736L7.75736 28.2426C6.63214 29.3679 5.10602 30 3.51472 30H0V29H3.01472C4.60602 29 6.13214 28.3679 7.25736 27.2426L27.2426 7.25736C28.3679 6.13214 29 4.60602 29 3.01472V0H30V3.51472C30 5.10602 29.3679 6.63214 28.2426 7.75736Z"
						/>
					</svg>
				{/if}
			</div>
		</div>
	{/if}
</div>
