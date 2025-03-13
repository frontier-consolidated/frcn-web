const seconds_divisor = 1000;
const minutes_divisor = 60 * seconds_divisor;
const hour_divisor = 60 * minutes_divisor;
const days_divisor = 24 * hour_divisor;

const formatter = new Intl.DateTimeFormat(
	typeof navigator !== "undefined" ? navigator.language : "en",
	{
		day: "2-digit",
		month: "2-digit",
		year: "2-digit"
	}
);

Date.prototype.toRelativeString = function (this: Date, relativeTo?: Date) {
	relativeTo ??= new Date();

	let diff = relativeTo.getTime() - this.getTime();
	const future = diff < 0;
	diff = Math.abs(diff);

	const template = future ? "in %s" : "%s ago";

	const total_seconds = Math.floor(diff / seconds_divisor);
	if (total_seconds < 5) {
		return "Just now";
	}

	const seconds = total_seconds % 60;
	const total_minutes = Math.floor(diff / minutes_divisor);
	if (total_minutes === 0) {
		return template.replace("%s", `${seconds} sec${seconds > 1 ? "s" : ""}`);
	}

	const minutes = total_minutes % 60;
	const total_hours = Math.floor(diff / hour_divisor);
	if (total_hours === 0) {
		return template.replace("%s", `${minutes} min${minutes > 1 ? "s" : ""}`);
	}

	const hours = total_hours % 24;
	const days = Math.floor(diff / days_divisor);
	if (days === 0) {
		return template.replace("%s", `${hours} hour${hours > 1 ? "s" : ""}`);
	}

	if (days < 2) {
		return "Yesterday";
	}

	return formatter.format(this);
};
