<script lang="ts">
	import { Badge, Popover } from "flowbite-svelte";
	import { locale } from "svelte-i18n";
	import { dates } from "@frcn/shared";

	export let id: string;
	export let format: "duration" | "datetime" | "datetime-relative" = "datetime";
	export let value: number;

	let datetime: string;
	let text: string;
	let popoverText: string;

	switch (format) {
		case "duration":
			{
				text = dates.toDuration(value);
				popoverText = text;

				const { hours, minutes, seconds } = dates.toDurationComponents(value);
				datetime = `PT${hours}H${minutes}M${seconds}S`;
			}
			break;
		case "datetime":
			{
				const now = new Date();
				const date = new Date(value);

				const hoursMinutes = new Intl.DateTimeFormat($locale!, {
					hour: "2-digit",
					minute: "2-digit",
				}).format(date);

				if (dates.isToday(date)) {
					text = `Today ${hoursMinutes}`;
				} else if (dates.isTomorrow(date)) {
					text = `Tomorrow ${hoursMinutes}`;
				} else if (dates.isYesterday(date)) {
					text = `Yesterday ${hoursMinutes}`;
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

				popoverText = date.toString();
				datetime = date.toISOString();
			}
			break;
		case "datetime-relative":
			{
				const now = new Date();
				const date = new Date(value);

				const hoursMinutes = new Intl.DateTimeFormat($locale!, {
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
					text = `Today ${hoursMinutes} (${relative})`;
				} else if (dates.isTomorrow(date)) {
					text = `Tomorrow ${hoursMinutes} (${relative})`;
				} else if (dates.isYesterday(date)) {
					text = `Yesterday ${hoursMinutes}`;
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

				popoverText = date.toString();
				datetime = date.toISOString();
			}
			break;
	}
</script>

<Badge {id} color="none" class="dark:text-gray-300" {...$$restProps}>
	<time {datetime}>{text}</time>
</Badge>
<Popover defaultClass="px-2 py-1 text-xs" triggeredBy="#{id}">{popoverText}</Popover>
