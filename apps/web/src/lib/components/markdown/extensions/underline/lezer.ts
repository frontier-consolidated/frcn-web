import { Tag, tags } from "@lezer/highlight";
import type { MarkdownConfig } from "@lezer/markdown";

import { Punctuation } from "../utils";

const UnderlineDelim = { resolve: "Underline", mark: "UnderlineMark" };

export const underline = Tag.define(tags.content);

export const Underline: MarkdownConfig = {
    defineNodes: [{
      name: "Underline",
      style: { "Underline/...": underline }
    }, {
      name: "UnderlineMark",
      style: tags.processingInstruction
    }],
    parseInline: [{
      name: "Underline",
      parse(cx, next, pos) {
        if (next != 95 /* '_' */ || cx.char(pos + 1) != 95 || cx.char(pos + 2) == 95) return -1;
        const before = cx.slice(pos - 1, pos), after = cx.slice(pos + 2, pos + 3);
        const text_before = /\s|^$/.test(before), text_after = /\s|^$/.test(after);
        const punc_before = Punctuation.test(before), punc_after = Punctuation.test(after);
        return cx.addDelimiter(UnderlineDelim, pos, pos + 2,
                               !text_after && (!punc_after || text_before || punc_before),
                               !text_before && (!punc_before || text_after || punc_after));
      },
      before: "Emphasis"
    }]
  };