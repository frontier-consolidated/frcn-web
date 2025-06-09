export const commands = import.meta.glob<true, string>("./*.command.ts", { eager: true });
