<script lang="ts">
	import { Input } from "flowbite-svelte";

	const hours = new Array(24).fill(0).map((_, index) => index);
	const minutes = new Array(60).fill(0).map((_, index) => index);

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
	function scrollToHour(hour: number) {
		const el = hoursDiv?.querySelector<HTMLElement>(`[data-hour="${hour}"]`);
		if (el)
			el.scrollIntoView({
				behavior: "smooth",
				block: "center",
			});
	}
	function scrollToMinute(minute: number) {
		const el = minutesDiv?.querySelector<HTMLElement>(`[data-minute="${minute}"]`);
		if (el)
			el.scrollIntoView({
				behavior: "smooth",
				block: "center",
			});
	}

	function initHours(el: HTMLElement) {
		hoursDiv = el;
		scrollToHour(selectedHour);
	}
	function initMinutes(el: HTMLElement) {
		minutesDiv = el;
		scrollToMinute(selectedMinute);
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
</script>

<div>
	<div class="flex justify-between items-center mb-2 p-1">
		<Input
			bind:value={inputHour}
			class="w-14 text-center no-inner-spin"
			type="number"
			min="0"
			max="23"
		/>
		<span class="font-bold">:</span>
		<Input
			bind:value={inputMinute}
			class="w-14 text-center no-inner-spin"
			type="number"
			min="0"
			max="59"
		/>
	</div>
	<div class="grid grid-cols-2 h-56 w-32">
		<div use:initHours class="overflow-y-scroll no-scrollbar">
			{#each hours as hour}
				<span
					role="button"
					tabindex="0"
					data-hour={hour}
					class="block rounded-lg text-center text-sm font-semibold px-2 py-1 dark:text-white cursor-pointer {hour ==
					selectedHour
						? 'bg-primary-600 dark:hover:bg-primary-700'
						: 'dark:hover:bg-gray-600'}"
					on:click={() => setHour(hour)}
					on:keydown={(ev) => {
						if (ev.key == "Enter") setHour(hour);
					}}
				>
					{pad(hour)}
				</span>
			{/each}
		</div>
		<div use:initMinutes class="overflow-y-scroll no-scrollbar">
			{#each minutes as minute}
				<span
					role="button"
					tabindex="0"
					data-minute={minute}
					class="block rounded-lg text-center text-sm font-semibold px-2 py-1 dark:text-white cursor-pointer {minute ==
					selectedMinute
						? 'bg-primary-600 dark:hover:bg-primary-700'
						: 'dark:hover:bg-gray-600'}"
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
