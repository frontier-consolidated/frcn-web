import type Data from "./emojis";
import json from "./emojis.json" assert { type: "json" };

export const data = json as Data;

export function get_emoji_by_name(name: string) {
    return data.emojis.find(e => e.names.includes(name));
}