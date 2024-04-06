import { browser } from "$app/environment";
import { writable } from "svelte/store";
import { v4 as uuidv4 } from "uuid";

export type Notification = {
	type: "error" | "info" | "success";
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

	return () => {
		clearInterval(interval);
	};
});

export function pushNotification(notification: Omit<Notification, "id" | "exitAt">) {
	notifications.update((value) => {
		return [
			...value,
			{
				...notification,
				id: uuidv4(),
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
