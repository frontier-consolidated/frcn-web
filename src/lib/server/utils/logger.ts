import util from "util";

import { env } from "$env/dynamic/private";

const FOREGROUND_COLORS = {
	black: "\x1b[30m",
	red: "\x1b[31m",
	green: "\x1b[32m",
	yellow: "\x1b[33m",
	blue: "\x1b[34m",
	magenta: "\x1b[35m",
	cyan: "\x1b[36m",
	white: "\x1b[37m",
	gray: "\x1b[90m"
};

const BACKGROUND_COLORS = {
	black: "\x1b[40m",
	red: "\x1b[41m",
	green: "\x1b[42m",
	yellow: "\x1b[44m",
	blue: "\x1b[44m",
	magenta: "\x1b[45m",
	cyan: "\x1b[46m",
	white: "\x1b[47m",
	gray: "\x1b[100m"
};

const MODIFIERS = {
	reset: "\x1b[0m",
	bright: "\x1b[1m",
	dim: "\x1b[2m",
	underscore: "\x1b[4m",
	blink: "\x1b[5m",
	reverse: "\x1b[7m",
	hidden: "\x1b[8m"
};

function style(
	message: string,
	style: {
		fg?: keyof typeof FOREGROUND_COLORS;
		bg?: keyof typeof BACKGROUND_COLORS;
		modifier?: keyof typeof MODIFIERS;
	}
) {
	let prefix = "";
	if (style.fg) {
		prefix += FOREGROUND_COLORS[style.fg];
	}
	if (style.bg) {
		prefix += BACKGROUND_COLORS[style.bg];
	}
	if (style.modifier) {
		prefix += MODIFIERS[style.modifier];
	}
	return `${prefix}${message.replace("\x1b[0m", "\x1b[0m" + prefix)}\x1b[0m`;
}

function getPrimaryMessage(...args: any[]) {
	let message = args[0];
	if (typeof message === "string") {
		args.shift();
	} else {
		message = "";
	}
	return [message, args];
}

function internalLog(stream: NodeJS.WriteStream, ...params: any[]) {
	const [message, args] = getPrimaryMessage(...params);
	const log = util
		.formatWithOptions(
			{
				colors: true,
				depth: 3,
				maxArrayLength: 10,
				compact: true,
				breakLength: 512
			},
			`${message}${args.length > 0 ? "\n" : ""}`,
			...args
		)
		.trimEnd();

	stream.write(`(${new Date().toISOString()}) ` + log + "\n");
}

function log(...params: any[]) {
	internalLog(process.stdout, ...params);
}

function debug(...params: any[]) {
	if (!env.NODE_ENV || env.NODE_ENV.trim() === "production") return;

	const [message, args] = getPrimaryMessage(...params);
	internalLog(process.stdout, style(`[DEBUG] ${message}`, { fg: "gray" }), ...args);
}

function info(...params: any[]) {
	const [message, args] = getPrimaryMessage(...params);
	internalLog(process.stdout, `[INFO] ${message}`, ...args);
}

function warn(...params: any[]) {
	const [message, args] = getPrimaryMessage(...params);
	internalLog(process.stdout, `${style("[WARN]", { fg: "yellow" })} ${message}`, ...args);
}

function error(...params: any[]) {
	const [message, args] = getPrimaryMessage(...params);
	internalLog(process.stderr, `${style("[ERROR]", { fg: "red" })} ${message}`, ...args);
}

function audit<TActor extends { type: string; id: string | number }>(
	actor: TActor,
	message: string,
	data?: any
) {
	const msg = ["[AUDIT]"];
	msg.push(style(`${actor.type}:${actor.id}`, { fg: "white", modifier: "bright" }));
	msg.push(message);

	log(style(msg.join(" "), { fg: "cyan" }), { actor, data });
}

export const logger = {
	style,
	debug,
	log,
	info,
	warn,
	error,
	audit
};
