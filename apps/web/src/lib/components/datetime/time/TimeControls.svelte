<script lang="ts">
	import { Input } from "flowbite-svelte";
	import { twMerge } from "tailwind-merge";

	const hours = new Array(24).fill(0).map((_, index) => index);
	const minutes = new Array(60).fill(0).map((_, index) => index);

	export let selectedDate: Date | null;

	let selected_hour: number = 0;
	let selected_minute: number = 0;

	function pad(number: number) {
		return number.toString().padStart(2, "0");
	}

	let input_hour = pad(selected_hour);
	let input_minute = pad(selected_minute);

	let hours_div: HTMLElement | null = null;
	let minutes_div: HTMLElement | null = null;
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

	function init_hours(el: HTMLElement) {
		hours_div = el;
		scroll_to_hour(selected_hour, true);
	}
	function init_minutes(el: HTMLElement) {
		minutes_div = el;
		scroll_to_minute(selected_minute, true);
	}

	function set_hour(hour: number) {
		input_hour = pad(hour);
		selected_hour = hour;

		scroll_to_hour(hour);

		const new_date = new Date(selectedDate!);
		new_date.setHours(hour);
		selectedDate = new_date;
	}

	function set_minute(minute: number) {
		input_minute = pad(minute);
		selected_minute = minute;

		scroll_to_minute(minute);

		const new_date = new Date(selectedDate!);
		new_date.setMinutes(minute);
		selectedDate = new_date;
	}

	$: {
		selectedDate ??= new Date();
		set_hour(selectedDate.getHours() ?? 0);
		set_minute(selectedDate.getMinutes() ?? 0);
	}

	$: {
		const hour = Math.max(0, Math.min(23, Number(input_hour)));
		set_hour(hour.valueOf());
	}
	$: {
		const minute = Math.max(0, Math.min(59, Number(input_minute)));
		set_minute(minute.valueOf());
	}

	const span_class = "block rounded-lg text-center text-sm font-semibold px-2 py-1 dark:text-white cursor-pointer";
	const active_class = "bg-primary-600 dark:hover:bg-primary-700";
	const inactive_class = "dark:hover:bg-gray-600";
</script>

<div>
	<div class="flex justify-between items-center mb-2 p-1">
		<Input
			bind:value={input_hour}
			class="w-14 text-center no-inner-spin rounded"
			type="number"
			min="0"
			max="23"
		/>
		<span class="font-bold">:</span>
		<Input
			bind:value={input_minute}
			class="w-14 text-center no-inner-spin rounded"
			type="number"
			min="0"
			max="59"
		/>
	</div>
	<div class="grid grid-cols-2 h-56 w-32">
		<div use:init_hours class="overflow-y-scroll no-scrollbar">
			{#each hours as hour}
				<span
					role="button"
					tabindex="0"
					data-hour={hour}
					class={twMerge(span_class, hour === selected_hour ? active_class : inactive_class)}
					on:click={() => set_hour(hour)}
					on:keydown={(ev) => {
						if (ev.key == "Enter") set_hour(hour);
					}}
				>
					{pad(hour)}
				</span>
			{/each}
		</div>
		<div use:init_minutes class="overflow-y-scroll no-scrollbar">
			{#each minutes as minute}
				<span
					role="button"
					tabindex="0"
					data-minute={minute}
					class={twMerge(span_class, minute === selected_minute ? active_class : inactive_class)}
					on:click={() => set_minute(minute)}
					on:keydown={(ev) => {
						if (ev.key == "Enter") set_minute(minute);
					}}
				>
					{pad(minute)}
				</span>
			{/each}
		</div>
	</div>
</div>
