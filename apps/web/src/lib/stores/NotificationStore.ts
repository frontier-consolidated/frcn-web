import { browser } from "$app/environment";
import { writable } from "svelte/store";

export type Notification = {
	type: "error";
	message: string;
	timeout?: number;
	id: string;
	exitAt: number;
};

export const notifications = writable<Notification[]>([], (set, update) => {
	if (!browser) return;

	const interval = setInterval(() => {
		update((value) => {
			return value.filter((notif) => notif.exitAt > Date.now());
		});
	}, 500);

	// const testInterval = setInterval(() => {
	// 	pushNotification({
	// 		type: "error",
	// 		message: "test",
	// 	});
	// }, 5000);

	return () => {
		clearInterval(interval);
		// clearInterval(testInterval);
	};
});

export function pushNotification(notification: Omit<Notification, "id" | "exitAt">) {
	notifications.update((value) => {
		return [
			...value,
			{
				...notification,
				id: crypto.randomUUID(),
				exitAt: Date.now() + (notification.timeout ?? 30000),
			},
		];
	});
}

export function dropNotification(id: string) {
	notifications.update((value) => {
		return value.filter((notif) => notif.id !== id);
	});
}