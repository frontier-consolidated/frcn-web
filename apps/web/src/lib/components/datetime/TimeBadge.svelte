<script lang="ts">
	import { dates } from "@frcn/shared";
	import { Badge, Popover } from "flowbite-svelte";
	import { onMount } from "svelte";
	import { locale } from "svelte-i18n";
	import { twMerge } from "tailwind-merge";

	export let id: string;
	export let format: "duration" | "datetime" | "datetime-relative" = "datetime";
	export let value: number;
	
	function format_time(value: number) {
		let datetime: string;
		let text: string;
		let popover_text: string;

		switch (format) {
			case "duration":
				{
					text = dates.toDuration(value);
					popover_text = text;

					const { hours, minutes, seconds } = dates.toDurationComponents(value);
					datetime = `PT${hours}H${minutes}M${seconds}S`;
				}
				break;
			case "datetime":
				{
					const now = new Date();
					const date = new Date(value);

					const hours_minutes = new Intl.DateTimeFormat($locale!, {
						hour: "2-digit",
						minute: "2-digit",
					}).format(date);

					if (dates.isToday(date)) {
						text = `Today ${hours_minutes}`;
					} else if (dates.isTomorrow(date)) {
						text = `Tomorrow ${hours_minutes}`;
					} else if (dates.isYesterday(date)) {
						text = `Yesterday ${hours_minutes}`;
					} else if (now > date) {
						text = new Intl.DateTimeFormat($locale!, {
							dateStyle: "short",
							timeStyle: "short",
						}).format(date);
					} else {
						text = new Intl.DateTimeFormat($locale!, {
							dateStyle: "full",
							timeStyle: "short",
						}).format(date);
					}

					popover_text = date.toString();
					datetime = date.toISOString();
				}
				break;
			case "datetime-relative":
				{
					const now = new Date();
					const date = new Date(value);

					const hours_minutes = new Intl.DateTimeFormat($locale!, {
						hour: "2-digit",
						minute: "2-digit",
					}).format(date);

					let relative = "";
					if (now > date) {
						relative = `${dates.toDuration(now.getTime() - date.getTime())} ago`;
					} else {
						relative = `in ${dates.toDuration(date.getTime() - now.getTime())}`;
					}

					if (dates.isToday(date)) {
						text = `Today ${hours_minutes} (${relative})`;
					} else if (dates.isTomorrow(date)) {
						text = `Tomorrow ${hours_minutes} (${relative})`;
					} else if (dates.isYesterday(date)) {
						text = `Yesterday ${hours_minutes}`;
					} else if (now > date) {
						text = new Intl.DateTimeFormat($locale!, {
							dateStyle: "short",
							timeStyle: "short",
						}).format(date);
					} else {
						text = new Intl.DateTimeFormat($locale!, {
							dateStyle: "full",
							timeStyle: "short",
						}).format(date);
					}

					popover_text = date.toString();
					datetime = date.toISOString();
				}
				break;
		}

		return {
			datetime,
			text,
			popover_text
		};
	}

	let { datetime, text, popover_text } = format_time(value);

	onMount(() => {
		const interval = setInterval(() => {
			const updated = format_time(value);
			datetime = updated.datetime;
			text = updated.text;
			popover_text = updated.popover_text;
		}, 15000);

		return () => clearInterval(interval);
	});
</script>

<Badge {id} color="none" {...$$restProps} class={twMerge("tabular-nums dark:text-gray-300", $$restProps.class)}>
	<time {datetime}>{text}</time>
</Badge>
<Popover defaultClass="px-2 py-1 text-xs" triggeredBy="#{id}">{popover_text}</Popover>
