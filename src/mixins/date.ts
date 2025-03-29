const secondsDivisor = 1000;
const minutesDivisor = 60 * secondsDivisor;
const hoursDivisor = 60 * minutesDivisor;
const daysDivisor = 24 * hoursDivisor;

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

	const totalSeconds = Math.floor(diff / secondsDivisor);
	if (totalSeconds < 5) {
		return "Just now";
	}

	const seconds = totalSeconds % 60;
	const totalMinutes = Math.floor(diff / minutesDivisor);
	if (totalMinutes === 0) {
		return template.replace("%s", `${seconds} sec${seconds > 1 ? "s" : ""}`);
	}

	const minutes = totalMinutes % 60;
	const totalHours = Math.floor(diff / hoursDivisor);
	if (totalHours === 0) {
		return template.replace("%s", `${minutes} min${minutes > 1 ? "s" : ""}`);
	}

	const hours = totalHours % 24;
	const days = Math.floor(diff / daysDivisor);
	if (days === 0) {
		return template.replace("%s", `${hours} hour${hours > 1 ? "s" : ""}`);
	}

	if (days < 2) {
		return "Yesterday";
	}

	return formatter.format(this);
};
