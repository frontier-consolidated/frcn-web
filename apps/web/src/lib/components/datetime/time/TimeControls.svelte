<script lang="ts">
	import { Input } from "flowbite-svelte";
	import { twMerge } from "tailwind-merge";

	const hours = new Array(24).fill(0).map((_, index) => index);
	const minutes = new Array(12).fill(0).map((_, index) => index*5);

	export let selectedDate: Date | null;

	let selectedHour: number = 0;
	let selectedMinute: number = 0;

	function pad(number: number) {
		return number.toString().padStart(2, "0");
	}

	let inputHour = pad(selectedHour);
	let inputMinute = pad(selectedMinute);

	let hoursDiv: HTMLElement | null = null;
	let minutesDiv: HTMLElement | null = null;
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

	function initHours(el: HTMLElement) {
		hoursDiv = el;
		scrollToHour(selectedHour, true);
	}
	function initMinutes(el: HTMLElement) {
		minutesDiv = el;
		scrollToMinute(selectedMinute, true);
	}

	function setHour(hour: number) {
		inputHour = pad(hour);
		selectedHour = hour;

		scrollToHour(hour);

		const newDate = new Date(selectedDate!);
		newDate.setHours(hour);
		selectedDate = newDate;
	}

	function setMinute(minute: number) {
		inputMinute = pad(minute);
		selectedMinute = minute;

		scrollToMinute(minute);

		const newDate = new Date(selectedDate!);
		newDate.setMinutes(minute);
		selectedDate = newDate;
	}

	$: {
		selectedDate ??= new Date();
		setHour(selectedDate.getHours() ?? 0);
		setMinute(selectedDate.getMinutes() ?? 0);
	}

	$: {
		const hour = Math.max(0, Math.min(23, Number(inputHour)));
		setHour(hour.valueOf());
	}
	$: {
		const minute = Math.max(0, Math.min(59, Number(inputMinute)));
		setMinute(minute.valueOf());
	}

	const spanClass =
		"block rounded-lg text-center text-sm font-semibold px-2 py-1 dark:text-white cursor-pointer";
	const activeClass = "bg-primary-600 dark:hover:bg-primary-700";
	const inactiveClass = "dark:hover:bg-gray-600";
</script>

<div>
	<div class="mb-2 flex items-center justify-between p-1">
		<Input
			bind:value={inputHour}
			class="no-inner-spin w-14 rounded text-center"
			type="number"
			min="0"
			max="23"
		/>
		<span class="font-bold">:</span>
		<Input
			bind:value={inputMinute}
			class="no-inner-spin w-14 rounded text-center"
			type="number"
			min="0"
			max="59"
		/>
	</div>
	<div class="grid h-56 w-32 grid-cols-2">
		<div use:initHours class="no-scrollbar overflow-y-scroll">
			{#each hours as hour (hour)}
				<span
					role="button"
					tabindex="0"
					data-hour={hour}
					class={twMerge(spanClass, hour === selectedHour ? activeClass : inactiveClass)}
					on:click={() => setHour(hour)}
					on:keydown={(ev) => {
						if (ev.key == "Enter") setHour(hour);
					}}
				>
					{pad(hour)}
				</span>
			{/each}
		</div>
		<div use:initMinutes class="no-scrollbar overflow-y-scroll">
			{#each minutes as minute (minute)}
				<span
					role="button"
					tabindex="0"
					data-minute={minute}
					class={twMerge(spanClass, minute === selectedMinute ? activeClass : inactiveClass)}
					on:click={() => setMinute(minute)}
					on:keydown={(ev) => {
						if (ev.key == "Enter") setMinute(minute);
					}}
				>
					{pad(minute)}
				</span>
			{/each}
		</div>
	</div>
</div>
