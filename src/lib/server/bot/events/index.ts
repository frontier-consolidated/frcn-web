export const eventListeners = import.meta.glob<true, string>("./**/*.event.ts", { eager: true });
