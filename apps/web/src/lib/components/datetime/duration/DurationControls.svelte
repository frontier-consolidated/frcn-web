<script lang="ts">
	import { dates } from "@frcn/shared";
	import { Input } from "flowbite-svelte";
	import { twMerge } from "tailwind-merge";

	const hours = new Array(24).fill(0).map((_, index) => index);
	const minutes_and_seconds = new Array(60).fill(0).map((_, index) => index);

	export let value: number | null;

	function set_components({
		hours,
		minutes,
		seconds,
		milliseconds,
	}: {
		hours?: number;
		minutes?: number;
		seconds?: number;
		milliseconds?: number;
	}) {
		const {
			hours: hours_,
			minutes: minutes_,
			seconds: seconds_,
			milliseconds: milliseconds_,
		} = dates.toDurationComponents(value);
		hours ??= hours_;
		minutes ??= minutes_;
		seconds ??= seconds_;
		milliseconds ??= milliseconds_;
		value = hours * 3600 * 1000 + minutes * 60 * 1000 + seconds * 1000 + milliseconds;
	}

	function pad(number: number) {
		return number.toString().padStart(2, "0");
	}

	let input_hours = pad(dates.toDurationComponents(value).hours);
	let input_minutes = pad(dates.toDurationComponents(value).minutes);
	let input_seconds = pad(dates.toDurationComponents(value).seconds);

	let hours_div: HTMLElement | null = null;
	let minutes_div: HTMLElement | null = null;
	let seconds_div: HTMLElement | null = null;
	function scroll_to_hour(hour: number, instant?: boolean) {
		const el = hours_div?.querySelector<HTMLElement>(`[data-hour="${hour}"]`);
		if (el)
			el.scrollIntoView({
				behavior: instant ? "instant" : "smooth",
				block: "center",
			});
	}
	function scroll_to_minute(minute: number, instant?: boolean) {
		const el = minutes_div?.querySelector<HTMLElement>(`[data-minute="${minute}"]`);
		if (el)
			el.scrollIntoView({
				behavior: instant ? "instant" : "smooth",
				block: "center",
			});
	}
	function scroll_to_second(second: number, instant?: boolean) {
		const el = seconds_div?.querySelector<HTMLElement>(`[data-second="${second}"]`);
		if (el)
			el.scrollIntoView({
				behavior: instant ? "instant" : "smooth",
				block: "center",
			});
	}

	function init_hours(el: HTMLElement) {
		hours_div = el;
		scroll_to_hour(dates.toDurationComponents(value).hours, true);
	}
	function init_minutes(el: HTMLElement) {
		minutes_div = el;
		scroll_to_minute(dates.toDurationComponents(value).minutes, true);
	}
	function init_seconds(el: HTMLElement) {
		seconds_div = el;
		scroll_to_second(dates.toDurationComponents(value).seconds, true);
	}

	function set_hours(hours: number) {
		input_hours = pad(hours);
		scroll_to_hour(hours);
		set_components({ hours });
	}

	function set_minutes(minutes: number) {
		input_minutes = pad(minutes);
		scroll_to_minute(minutes);
		set_components({ minutes });
	}

	function set_seconds(seconds: number) {
		input_seconds = pad(seconds);
		scroll_to_second(seconds);
		set_components({ seconds });
	}

	$: {
		if (value) {
			set_hours(dates.toDurationComponents(value).hours);
			set_minutes(dates.toDurationComponents(value).minutes);
		}
	}

	$: {
		const hour = Math.max(0, Number(input_hours));
		set_hours(hour.valueOf());
	}
	$: {
		const minute = Math.max(0, Math.min(59, Number(input_minutes)));
		set_minutes(minute.valueOf());
	}
	$: {
		const seconds = Math.max(0, Math.min(59, Number(input_seconds)));
		set_seconds(seconds.valueOf());
	}

	const span_class = "block rounded-lg text-center text-sm font-semibold px-2 py-1 dark:text-white cursor-pointer";
	const active_class = "bg-primary-600 dark:hover:bg-primary-700";
	const inactive_class = "dark:hover:bg-gray-600";
</script>

<div>
	<div class="grid grid-flow-col items-center mb-2 p-1">
		<Input
			bind:value={input_hours}
			class="w-10 text-center no-inner-spin rounded"
			type="number"
			min="0"
		/>
		<span class="font-semibold p-1 me-1">hours</span>
		<Input
			bind:value={input_minutes}
			class="w-10 text-center no-inner-spin rounded"
			type="number"
			min="0"
			max="59"
		/>
		<span class="font-semibold p-1 me-1">mins</span>
		<Input
			bind:value={input_seconds}
			class="w-10 text-center no-inner-spin rounded"
			type="number"
			min="0"
			max="59"
		/>
		<span class="font-semibold p-1 me-1">secs</span>
	</div>
	<div class="grid grid-cols-3 h-28 w-full gap-4">
		<div use:init_hours class="overflow-y-scroll no-scrollbar">
			{#each hours as hour}
				<span
					role="button"
					tabindex="0"
					data-hour={hour}
					class={twMerge(span_class, hour === dates.toDurationComponents(value).hours ? active_class : inactive_class)}
					on:click={() => set_hours(hour)}
					on:keydown={(ev) => {
						if (ev.key == "Enter") set_hours(hour);
					}}
				>
					{pad(hour)}
				</span>
			{/each}
		</div>
		<div use:init_minutes class="overflow-y-scroll no-scrollbar">
			{#each minutes_and_seconds as minute}
				<span
					role="button"
					tabindex="0"
					data-minute={minute}
					class={twMerge(span_class, minute === dates.toDurationComponents(value).minutes ? active_class : inactive_class)}
					on:click={() => set_minutes(minute)}
					on:keydown={(ev) => {
						if (ev.key == "Enter") set_minutes(minute);
					}}
				>
					{pad(minute)}
				</span>
			{/each}
		</div>
		<div use:init_seconds class="overflow-y-scroll no-scrollbar">
			{#each minutes_and_seconds as second}
				<span
					role="button"
					tabindex="0"
					data-second={second}
					class={twMerge(span_class, second === dates.toDurationComponents(value).seconds ? active_class : inactive_class)}
					on:click={() => set_seconds(second)}
					on:keydown={(ev) => {
						if (ev.key == "Enter") set_seconds(second);
					}}
				>
					{pad(second)}
				</span>
			{/each}
		</div>
	</div>
</div>
