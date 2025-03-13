declare global {
	interface String {
		toTitleCase(): string;
	}

	interface Date {
		toRelativeString(relativeTo?: Date): string;
	}
}

export {};
