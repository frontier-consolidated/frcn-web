export const daysPerMonth = 42;

export function getDaysInMonth(date: Date) {
	return daysPerMonth - new Date(date.getFullYear(), date.getMonth(), daysPerMonth).getDate();
}

export function getCenturyStartYear(date: Date) {
	return new Date(Math.floor(date.getFullYear() / 100) * 100, date.getMonth());
}

export function getNextCentury(date: Date) {
	const startYear = getCenturyStartYear(date);
	return new Date(startYear.getFullYear() + 100, date.getMonth());
}

export function getPreviousCentury(date: Date) {
	const startYear = getCenturyStartYear(date);
	return new Date(startYear.getFullYear() - 100, date.getMonth());
}

export function getDecadeStartYear(date: Date) {
	return new Date(Math.floor(date.getFullYear() / 10) * 10, date.getMonth());
}

export function getNextDecade(date: Date) {
	const startYear = getDecadeStartYear(date);
	return new Date(startYear.getFullYear() + 10, date.getMonth());
}

export function getPreviousDecade(date: Date) {
	const startYear = getDecadeStartYear(date);
	return new Date(startYear.getFullYear() - 10, date.getMonth());
}

export function getNextYear(date: Date) {
	return new Date(date.getFullYear() + 1, date.getMonth());
}

export function getPreviousYear(date: Date) {
	return new Date(date.getFullYear() - 1, date.getMonth());
}

export function getNextMonth(date: Date) {
	return new Date(
		date.getFullYear() + (date.getMonth() == 11 ? 1 : 0),
		date.getMonth() == 11 ? 0 : date.getMonth() + 1
	);
}

export function getPreviousMonth(date: Date) {
	return new Date(
		date.getFullYear() - (date.getMonth() == 0 ? 1 : 0),
		date.getMonth() == 0 ? 11 : date.getMonth() - 1
	);
}

export function isCurrentMonth(month: Date, date: Date) {
	return date.getMonth() == month.getMonth();
}

export function isSelected(selected: Date | null, date: Date) {
	return selected && new Date(date).setHours(0, 0, 0, 0) == new Date(selected).setHours(0, 0, 0, 0);
}

export function isToday(date: Date) {
	return new Date(date).setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0);
}

export function isTomorrow(date: Date) {
	return (
		new Date(date).setHours(0, 0, 0, 0) ==
		new Date(Date.now() + 24 * 3600 * 1000).setHours(0, 0, 0, 0)
	);
}

export function isYesterday(date: Date) {
	return (
		new Date(date).setHours(0, 0, 0, 0) ==
		new Date(Date.now() - 24 * 3600 * 1000).setHours(0, 0, 0, 0)
	);
}

export function toDurationComponents(value?: number | null) {
	if (!value) {
		return {
			milliseconds: 0,
			seconds: 0,
			minutes: 0,
			hours: 0,
			days: 0
		};
	}
	const seconds = Math.floor(value / 1000);
	return {
		milliseconds: value % 1000,
		seconds: seconds % 60,
		minutes: Math.floor(seconds / 60) % 60,
		hours: Math.floor(seconds / 3600) % 24,
		days: Math.floor(seconds / 86400)
	};
}

export function toDuration(value: number) {
	const { days, hours, minutes, seconds } = toDurationComponents(value);

	const components: string[] = [];
	if (days > 0) {
		components.push(`${days} day${days > 1 ? "s" : ""}`);
	} else {
		if (hours > 0) {
			components.push(`${hours} hour${hours > 1 ? "s" : ""}`);
		}
		if (minutes > 0) {
			components.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);
		}
		if (seconds > 0) {
			components.push(`${seconds} second${seconds > 1 ? "s" : ""}`);
		}
	}
	return components.join(" ");
}
