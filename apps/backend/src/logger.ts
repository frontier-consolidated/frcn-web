/* eslint-disable @typescript-eslint/no-explicit-any */
import util from "util";

import type { AccessKey, User } from "@prisma/client";
import type { Request } from "express";


import { isProd } from "./env";
import type { GQLContext } from "./graphql/context";

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

function style(message: string, style: {
    fg?: keyof typeof FOREGROUND_COLORS;
    bg?: keyof typeof BACKGROUND_COLORS;
    modifier?: keyof typeof MODIFIERS;
}) {
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

function get_primary_message(...args: any[]) {
    let message = args[0];
    if (typeof message === "string") {
        args.shift();
    } else {
        message = "";
    }
    return [message, args];
}

function internal_log(stream: NodeJS.WriteStream, ...params: any[]) {
    const [message, args] = get_primary_message(...params);
    const log = util.formatWithOptions({
        colors: true,
        depth: 3,
        maxArrayLength: 10,
    }, `${message}${args.length > 0 ? "\n" : ""}`, ...args).trimEnd();


    // if (log === previousLog) {
    //     stream.cursorTo(0);
    //     stream.write(`(${new Date().toISOString()}) ` + log + ` ${style(`x${repeatLogCount}`, { fg: "gray" })} ${stream.rows}\n`);
    //     return;
    // }

    stream.write(`(${new Date().toISOString()}) ` + log + "\n");
}

function log(...params: any[]) {
    internal_log(process.stdout, ...params);
}

function debug(...params: any[]) {
    if (isProd()) return;

    const [message, args] = get_primary_message(...params);
    internal_log(process.stdout, style(`[DEBUG] ${message}`, { fg: "gray" }), ...args);
}

function info(...params: any[]) {
    const [message, args] = get_primary_message(...params);
    internal_log(process.stdout, `[INFO] ${message}`, ...args);
}

function warn(...params: any[]) {
    const [message, args] = get_primary_message(...params);
    internal_log(process.stdout, `${style("[WARN]", { fg: "yellow" })} ${message}`, ...args);
}

function error(...params: any[]) {
    const [message, args] = get_primary_message(...params);
    internal_log(process.stderr, `${style("[ERROR]", { fg: "red" })} ${message}`, ...args);
}

function audit(actor: User | AccessKey | GQLContext, message: string, data?: any) {
    let resolvedActor: { type: "User" | "AccessKey", id: string | number, name: string };
    if ("user" in actor || "accesskey" in actor) {
        if (actor.user) {
            actor = actor.user;
        } else if (actor.accesskey) {
            actor = actor.accesskey;
        } else {
            error("COULD NOT RESOLVE ACTOR IN AUDIT LOG");
            return;
        }
    }

    if ("discordId" in actor) {
        resolvedActor = { type: "User", id: actor.id, name: actor.scName ?? actor.discordName };
    } else {
        const key = actor as AccessKey;
        resolvedActor = { type: "AccessKey", id: key.id, name: key.description ? key.description : `AccessKey_${key.id}` };
    }

    const msg = ["[AUDIT]"];
    msg.push(style(resolvedActor.name, { fg: "white", modifier: "bright" }));
    msg.push(message);

    log(style(msg.join(" "), { fg: "cyan" }), JSON.stringify({ actor: resolvedActor, data }, null, 2).replace(/\s+/g, " "));
}

function requestDetails(req: Request) {
    return { url: req.url, elapsed: `${Math.round((Date.now() - req.timestamp.getTime()) / 100) / 10}s`, method: req.method, query: req.query, params: req.params };
}

export const logger = {
    style,
    debug,
    log,
    info,
    warn,
    error,
    audit,
    requestDetails
};