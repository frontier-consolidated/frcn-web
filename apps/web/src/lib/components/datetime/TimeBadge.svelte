<script lang="ts">
	import { Badge, Popover } from "flowbite-svelte";
	import { locale } from "svelte-i18n";
	import { isToday, isTomorrow, isYesterday, toDuration, toDurationComponents } from "./helpers";

	export let id: string;
	export let format: "duration" | "datetime" = "datetime";
	export let value: number;

	let datetime: string;
	let text: string;
	let popoverText: string;

	switch (format) {
		case "duration":
			{
				text = toDuration(value);
				popoverText = text;

				const { hours, minutes, seconds } = toDurationComponents(value);
				datetime = `PT${hours}H${minutes}M${seconds}S`;
			}
			break;
		case "datetime":
			{
				const date = new Date(value);

				const hoursMinutes = new Intl.DateTimeFormat($locale!, {
					hour: "2-digit",
					minute: "2-digit",
				}).format(date);

				let duration = "";
				const now = new Date();
				if (now > date) {
					duration = `${toDuration(now.getTime() - date.getTime())} ago`;
				} else {
					duration = `in ${toDuration(date.getTime() - now.getTime())}`;
				}

				if (isToday(date)) {
					text = `Today ${hoursMinutes} (${duration})`;
				} else if (isTomorrow(date)) {
					text = `Tomorrow ${hoursMinutes} (${duration})`;
				} else if (isYesterday(date)) {
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
