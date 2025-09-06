<script lang="ts">
	import { dates } from "@frcn/shared";
	import { Input } from "flowbite-svelte";
	import { twMerge } from "tailwind-merge";

	const hours = new Array(24).fill(0).map((_, index) => index);
	const minutesAndSeconds = new Array(60).fill(0).map((_, index) => index);

	export let value: number | null;

	function setComponents({
		hours,
		minutes,
		seconds,
		milliseconds
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
			milliseconds: milliseconds_
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

	let inputHours = pad(dates.toDurationComponents(value).hours);
	let inputMinutes = pad(dates.toDurationComponents(value).minutes);
	let inputSeconds = pad(dates.toDurationComponents(value).seconds);

	let hoursDiv: HTMLElement | null = null;
	let minutesDiv: HTMLElement | null = null;
	let secondsDiv: HTMLElement | null = null;
	function scrollToHour(hour: number, instant?: boolean) {
		const el = hoursDiv?.querySelector<HTMLElement>(`[data-hour="${hour}"]`);
		if (el)
			el.scrollIntoView({
				behavior: instant ? "instant" : "smooth",
				block: "center"
			});
	}
	function scrollToMinute(minute: number, instant?: boolean) {
		const el = minutesDiv?.querySelector<HTMLElement>(`[data-minute="${minute}"]`);
		if (el)
			el.scrollIntoView({
				behavior: instant ? "instant" : "smooth",
				block: "center"
			});
	}
	function scrollToSecond(second: number, instant?: boolean) {
		const el = secondsDiv?.querySelector<HTMLElement>(`[data-second="${second}"]`);
		if (el)
			el.scrollIntoView({
				behavior: instant ? "instant" : "smooth",
				block: "center"
			});
	}

	function initHours(el: HTMLElement) {
		hoursDiv = el;
		scrollToHour(dates.toDurationComponents(value).hours, true);
	}
	function initMinutes(el: HTMLElement) {
		minutesDiv = el;
		scrollToMinute(dates.toDurationComponents(value).minutes, true);
	}
	function initSeconds(el: HTMLElement) {
		secondsDiv = el;
		scrollToSecond(dates.toDurationComponents(value).seconds, true);
	}

	function setHours(hours: number) {
		inputHours = pad(hours);
		scrollToHour(hours);
		setComponents({ hours });
	}

	function setMinutes(minutes: number) {
		inputMinutes = pad(minutes);
		scrollToMinute(minutes);
		setComponents({ minutes });
	}

	function setSeconds(seconds: number) {
		inputSeconds = pad(seconds);
		scrollToSecond(seconds);
		setComponents({ seconds });
	}

	$: {
		if (value) {
			setHours(dates.toDurationComponents(value).hours);
			setMinutes(dates.toDurationComponents(value).minutes);
		}
	}

	$: {
		const hour = Math.max(0, Number(inputHours));
		setHours(hour.valueOf());
	}
	$: {
		const minute = Math.max(0, Math.min(59, Number(inputMinutes)));
		setMinutes(minute.valueOf());
	}
	$: {
		const seconds = Math.max(0, Math.min(59, Number(inputSeconds)));
		setSeconds(seconds.valueOf());
	}

	const spanClass =
		"block rounded-lg text-center text-sm font-semibold px-2 py-1 dark:text-white cursor-pointer";
	const activeClass = "bg-primary-600 dark:hover:bg-primary-700";
	const inactiveClass = "dark:hover:bg-gray-600";
</script>

<div>
	<div class="mb-2 grid grid-flow-col items-center p-1">
		<Input
			bind:value={inputHours}
			class="no-inner-spin w-10 rounded text-center"
			type="number"
			min="0"
		/>
		<span class="me-1 p-1 font-semibold">hours</span>
		<Input
			bind:value={inputMinutes}
			class="no-inner-spin w-10 rounded text-center"
			type="number"
			min="0"
			max="59"
		/>
		<span class="me-1 p-1 font-semibold">mins</span>
		<Input
			bind:value={inputSeconds}
			class="no-inner-spin w-10 rounded text-center"
			type="number"
			min="0"
			max="59"
		/>
		<span class="me-1 p-1 font-semibold">secs</span>
	</div>
	<div class="grid h-28 w-full grid-cols-3 gap-4">
		<div use:initHours class="no-scrollbar overflow-y-scroll">
			{#each hours as hour}
				<span
					role="button"
					tabindex="0"
					data-hour={hour}
					class={twMerge(
						spanClass,
						hour === dates.toDurationComponents(value).hours ? activeClass : inactiveClass
					)}
					on:click={() => setHours(hour)}
					on:keydown={(ev) => {
						if (ev.key == "Enter") setHours(hour);
					}}
				>
					{pad(hour)}
				</span>
			{/each}
		</div>
		<div use:initMinutes class="no-scrollbar overflow-y-scroll">
			{#each minutesAndSeconds as minute}
				<span
					role="button"
					tabindex="0"
					data-minute={minute}
					class={twMerge(
						spanClass,
						minute === dates.toDurationComponents(value).minutes ? activeClass : inactiveClass
					)}
					on:click={() => setMinutes(minute)}
					on:keydown={(ev) => {
						if (ev.key == "Enter") setMinutes(minute);
					}}
				>
					{pad(minute)}
				</span>
			{/each}
		</div>
		<div use:initSeconds class="no-scrollbar overflow-y-scroll">
			{#each minutesAndSeconds as second}
				<span
					role="button"
					tabindex="0"
					data-second={second}
					class={twMerge(
						spanClass,
						second === dates.toDurationComponents(value).seconds ? activeClass : inactiveClass
					)}
					on:click={() => setSeconds(second)}
					on:keydown={(ev) => {
						if (ev.key == "Enter") setSeconds(second);
					}}
				>
					{pad(second)}
				</span>
			{/each}
		</div>
	</div>
</div>
