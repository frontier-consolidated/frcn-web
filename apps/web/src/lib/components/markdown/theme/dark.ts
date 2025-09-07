import { tags } from "@lezer/highlight";
import { createTheme } from "@uiw/codemirror-themes";

import { customTags } from "../extensions";

export const darkTheme = createTheme({
	theme: "dark",
	styles: [
		{
			tag: [tags.string, tags.meta, tags.regexp],
			color: "#a5d6ff"
		},
		{
			tag: tags.url,
			class: "ͼurl",
			color: "#3492ef",
			textDecoration: "underline"
		},
		{
			tag: tags.heading,
			fontWeight: "bold"
		},
		{
			tag: tags.emphasis,
			fontStyle: "italic"
		},
		{
			tag: tags.strong,
			fontWeight: "bold"
		},
		{
			tag: customTags.underline,
			textDecoration: "underline"
		},
		{
			tag: tags.strikethrough,
			textDecoration: "line-through"
		},
		{
			tag: [tags.keyword, tags.typeName, tags.typeOperator],
			color: "#ff7b72"
		},
		{
			tag: [tags.atom, tags.bool, tags.contentSeparator, tags.labelName],
			color: "#219"
		},
		{
			tag: [tags.literal, tags.inserted],
			color: "#164"
		},
		{
			tag: tags.deleted,
			color: "#ffdcd7",
			backgroundColor: "ffeef0"
		},
		{
			tag: [tags.escape, tags.special(tags.string)],
			color: "#e40"
		},
		{
			tag: tags.definition(tags.variableName),
			color: "#00f"
		},
		{
			tag: tags.local(tags.variableName),
			color: "#30a"
		},
		{
			tag: [tags.className, tags.propertyName],
			color: "#d2a8ff"
		},
		{
			tag: [tags.special(tags.variableName), tags.macroName],
			color: "#256"
		},
		{
			tag: tags.processingInstruction,
			color: "#aab"
		},
		{
			tag: tags.comment,
			color: "#8b949e"
		},
		{
			tag: tags.character,
			color: "#d2a8ff"
		},
		{
			tag: tags.invalid,
			color: "#f00"
		}
	],
	settings: {
		background: "transparent",
		foreground: "#fff",
		selection: "#BBDFFF",
		selectionMatch: "#BBDFFF",
		gutterBackground: "#fff",
		gutterForeground: "#6e7781",
		fontFamily: "inherit"
	}
});
