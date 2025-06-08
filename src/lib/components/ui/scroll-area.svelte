<script lang="ts">
	import type { Snippet } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";
	import { twMerge } from "tailwind-merge";

	let {
		id,
		el = "div",
		direction,
		class: className,
		"outer-class": outerClass,
		"track-x-class": trackXClass,
		"track-y-class": trackYClass,
		"thumb-x-class": thumbXClass,
		"thumb-y-class": thumbYClass,
		children,
		...rest
	}: {
		id: string;
		el?: "div" | "section" | "main" | "nav" | "aside";
		direction: "X" | "Y" | "XY";
		class?: string;
		"outer-class"?: string;
		"track-x-class"?: string;
		"track-y-class"?: string;
		"thumb-x-class"?: string;
		"thumb-y-class"?: string;
		children?: Snippet;
	} & HTMLAttributes<HTMLDivElement> = $props();

	type ScrollData = {
		[axis in "X" | "Y"]: {
			track?: HTMLDivElement;
			thumb?: HTMLDivElement;
			dragOffset: number;
			ratio: number;
			value: number;
		};
	};

	let dragging = $state<"X" | "Y" | null>(null);
	let scrollArea: HTMLElement | undefined = undefined;
	const scrollData: ScrollData = $state({
		X: {
			dragOffset: 0,
			ratio: 0,
			value: 0
		},
		Y: {
			dragOffset: 0,
			ratio: 0,
			value: 0
		}
	});

	function updateThumb(axis: "X" | "Y") {
		const data = scrollData[axis];
		const thumb = data?.thumb;
		const track = data?.track;
		if (!scrollArea || !thumb || !track) return;

		let ratio = 1;
		let percent = 0;
		if (axis === "X") {
			ratio = scrollArea.clientWidth / scrollArea.scrollWidth;
			percent = scrollArea.scrollLeft / (scrollArea.scrollWidth - scrollArea.clientWidth);
			thumb.style.width = `${track.clientWidth * ratio}px`;
			thumb.style.left = `${scrollArea.scrollLeft * ratio}px`;
		} else if (axis === "Y") {
			ratio = scrollArea.clientHeight / scrollArea.scrollHeight;
			percent = scrollArea.scrollTop / (scrollArea.scrollHeight - scrollArea.clientHeight);
			thumb.style.height = `${track.clientHeight * ratio}px`;
			thumb.style.top = `${scrollArea.scrollTop * ratio}px`;
		}

		data.ratio = ratio;
		data.value = percent * 100;
	}

	function updateThumbs() {
		updateThumb("X");
		updateThumb("Y");
	}

	function initTrack(track: HTMLDivElement, axis: "X" | "Y") {
		scrollData[axis].track = track;
		updateThumb(axis);
	}

	function initThumb(thumb: HTMLDivElement, axis: "X" | "Y") {
		scrollData[axis].thumb = thumb;
		updateThumb(axis);
	}

	function init(el: HTMLElement) {
		scrollArea = el;

		updateThumbs();
	}

	function preventClick(event: Event) {
		event.preventDefault();
		event.stopPropagation();
	}

	function onDragStart(event: MouseEvent, axis: "X" | "Y") {
		if (dragging) return;

		event.preventDefault();
		event.stopPropagation();

		dragging = axis;

		const data = scrollData[axis];

		const rect = data.thumb?.getBoundingClientRect();
		data.dragOffset =
			(axis === "X" ? event.pageX : event.pageY) - (rect ? rect[axis === "X" ? "left" : "top"] : 0);

		const doc = scrollArea?.ownerDocument ?? document;
		doc.addEventListener("mousemove", onDrag, true);
		doc.addEventListener("mouseup", onDragEnd, true);

		doc.addEventListener("click", preventClick, true);
		doc.addEventListener("dblclick", preventClick, true);
	}

	function onDragEnd(event: MouseEvent) {
		event.preventDefault();
		event.stopPropagation();

		dragging = null;

		const doc = scrollArea?.ownerDocument ?? document;
		doc.removeEventListener("mousemove", onDrag, true);
		doc.removeEventListener("mouseup", onDragEnd, true);

		setTimeout(() => {
			doc.removeEventListener("click", preventClick, true);
			doc.removeEventListener("dblclick", preventClick, true);
		});
	}

	function onDrag(event: MouseEvent) {
		if (!dragging || !scrollArea) return;

		event.preventDefault();
		event.stopPropagation();

		const axis = dragging;
		const data = scrollData[axis];

		const trackRect = data.track?.getBoundingClientRect();
		const dragPosition =
			(axis === "X" ? event.pageX : event.pageY) -
			(trackRect ? trackRect[axis === "X" ? "left" : "top"] : 0) -
			data.dragOffset;

		let dragSize = 0;
		if (axis === "X") {
			dragSize = (trackRect?.width ?? 0) * (1 - data.ratio);
		} else if (axis === "Y") {
			dragSize = (trackRect?.height ?? 0) * (1 - data.ratio);
		}

		const dragPercent = dragPosition / dragSize;

		if (axis === "X") {
			scrollArea.scrollLeft = dragPercent * (scrollArea.scrollWidth - scrollArea.clientWidth);
		} else if (axis === "Y") {
			scrollArea.scrollTop = dragPercent * (scrollArea.scrollHeight - scrollArea.clientHeight);
		}
	}
</script>

<div class={twMerge("group/scroll-area scroll-area relative overflow-hidden", outerClass)}>
	<svelte:element
		this={el}
		{id}
		role="presentation"
		{...rest}
		use:init
		class={twMerge(
			"scroll-area h-full",
			direction === "X" && "overflow-x-auto",
			direction === "Y" && "overflow-y-auto",
			direction === "XY" && "overflow-x-auto overflow-y-auto",
			className
		)}
		onmouseenter={() => updateThumbs()}
		onresize={() => updateThumbs()}
		onscroll={() => updateThumbs()}
	>
		{@render children?.()}
	</svelte:element>
	{#if direction === "X"}
		<div
			use:initTrack={"X"}
			class={twMerge(
				"scrollbar-track absolute top-0 right-0 z-1 h-2 w-full overflow-hidden",
				trackXClass
			)}
		>
			<div
				use:initThumb={"X"}
				role="scrollbar"
				aria-controls={id}
				aria-valuenow={scrollData.X.value}
				aria-orientation="horizontal"
				tabindex="-1"
				data-dragging={dragging === "X"}
				class={twMerge(
					"scrollbar-thumb bg-scrollbar absolute right-0 left-0 w-full rounded-full opacity-0 transition-opacity group-hover/scroll-area:opacity-100 data-[dragging='true']:opacity-100",
					thumbXClass
				)}
				onmousedown={(e) => onDragStart(e, "X")}
			></div>
		</div>
	{/if}
	{#if direction === "Y"}
		<div
			use:initTrack={"Y"}
			class={twMerge(
				"scrollbar-track absolute top-0 right-0 z-1 h-full w-2 overflow-hidden",
				trackYClass
			)}
		>
			<div
				use:initThumb={"Y"}
				role="scrollbar"
				aria-controls={id}
				aria-valuenow={scrollData.Y.value}
				aria-orientation="vertical"
				tabindex="-1"
				data-dragging={dragging === "Y"}
				class={twMerge(
					"scrollbar-thumb bg-scrollbar absolute right-0 left-0 w-full rounded-full opacity-0 transition-opacity group-hover/scroll-area:opacity-100 data-[dragging='true']:opacity-100",
					thumbYClass
				)}
				onmousedown={(e) => onDragStart(e, "Y")}
			></div>
		</div>
	{/if}
</div>

<style>
	@media (scripting: enabled) {
		.scroll-area {
			scrollbar-color: transparent transparent;
			scrollbar-width: none;
		}

		.scroll-area::-webkit-scrollbar {
			display: none;
		}
	}

	@media not (scripting: enabled) {
		.scroll-area .scrollbar-track {
			display: none;
		}

		.scroll-area::-webkit-scrollbar {
			width: calc(var(--spacing) * 2);
			height: calc(var(--spacing) * 2);
		}

		.scroll-area::-webkit-scrollbar-track {
			background-color: transparent;
		}

		.scroll-area::-webkit-scrollbar-thumb {
			border-radius: 1000px;
			background-color: var(--color-scrollbar);
		}
	}
</style>
