export const DAYS_PER_MONTH = 42;

export function get_days_in_month(date: Date) {
	return DAYS_PER_MONTH - new Date(date.getFullYear(), date.getMonth(), DAYS_PER_MONTH).getDate();
}

export function get_century_start_year(date: Date) {
	return new Date(Math.floor(date.getFullYear() / 100) * 100, date.getMonth());
}

export function get_next_century(date: Date) {
	const start_year = get_century_start_year(date);
	return new Date(start_year.getFullYear() + 100, date.getMonth());
}

export function get_previous_century(date: Date) {
	const start_year = get_century_start_year(date);
	return new Date(start_year.getFullYear() - 100, date.getMonth());
}

export function get_decade_start_year(date: Date) {
	return new Date(Math.floor(date.getFullYear() / 10) * 10, date.getMonth());
}

export function get_next_decade(date: Date) {
	const start_year = get_decade_start_year(date);
	return new Date(start_year.getFullYear() + 10, date.getMonth());
}

export function get_previous_decade(date: Date) {
	const start_year = get_decade_start_year(date);
	return new Date(start_year.getFullYear() - 10, date.getMonth());
}

export function get_next_year(date: Date) {
	return new Date(date.getFullYear() + 1, date.getMonth());
}

export function get_previous_year(date: Date) {
	return new Date(date.getFullYear() - 1, date.getMonth());
}

export function get_next_month(date: Date) {
	return new Date(
		date.getFullYear() + (date.getMonth() == 11 ? 1 : 0),
		date.getMonth() == 11 ? 0 : date.getMonth() + 1
	);
}

export function get_previous_month(date: Date) {
	return new Date(
		date.getFullYear() - (date.getMonth() == 0 ? 1 : 0),
		date.getMonth() == 0 ? 11 : date.getMonth() - 1
	);
}

export function is_current_month(month: Date, date: Date) {
	return date.getMonth() == month.getMonth();
}

export function is_selected_date(selected: Date | null, date: Date) {
	return (
		selected && new Date(date).setHours(0, 0, 0, 0) == new Date(selected).setHours(0, 0, 0, 0)
	);
}

export function is_today(date: Date) {
	return new Date(date).setHours(0, 0, 0, 0) == new Date().setHours(0, 0, 0, 0);
}

export function is_tomorrow(date: Date) {
	return (
		new Date(date).setHours(0, 0, 0, 0) ==
		new Date(Date.now() + 24 * 3600 * 1000).setHours(0, 0, 0, 0)
	);
}

export function is_yesterday(date: Date) {
	return (
		new Date(date).setHours(0, 0, 0, 0) ==
		new Date(Date.now() - 24 * 3600 * 1000).setHours(0, 0, 0, 0)
	);
}

export function to_duration_components(value?: number | null) {
	if (!value) {
		return {
			milliseconds: 0,
			seconds: 0,
			minutes: 0,
			hours: 0,
			days: 0,
		};
	}
	const seconds = Math.floor(value / 1000);
	return {
		milliseconds: value % 1000,
		seconds: seconds % 60,
		minutes: Math.floor(seconds / 60) % 60,
		hours: Math.floor(seconds / 3600) % 24,
		days: Math.floor(seconds / 86400),
	};
}

export function to_duration(value: number) {
	const { days, hours, minutes, seconds } = to_duration_components(value);

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
