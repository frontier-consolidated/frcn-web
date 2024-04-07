import crypto from "crypto";

const etagLookup = {
    "[]": "\"2-l9Fw4VUO7kr8CvBlt4zaMCqXZ0w\"",
    "{}": "\"2-vyGp6PvFo4RvsFtPoIWeCReyIC8\""
} as Record<string, string>;

export function createETag(value: string | Buffer) {
    if (value.length === 0) {
        // fast-path empty
        return "\"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk\"";
    }

    if (typeof value === "string" && etagLookup[value]) {
        return etagLookup[value];
    }

    // compute hash of entity
    const hash = crypto
      .createHash("sha1")
      .update(typeof value === "string" ? value : value.toString("utf8"), "utf8")
      .digest("base64")
      .substring(0, 27);
  
    // compute length of entity
    const len = typeof value === "string"
      ? Buffer.byteLength(value, "utf8")
      : value.length;
  
    return "\"" + len.toString(16) + "-" + hash + "\"";
}