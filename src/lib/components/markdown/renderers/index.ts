import Blockquote from "./Blockquote.svelte";
import Br from "./Br.svelte";
import Code from "./Code.svelte";
import Codespan from "./Codespan.svelte";
import Em from "./Em.svelte";
import Heading from "./Heading.svelte";
import Hr from "./Hr.svelte";
import Image from "./Image.svelte";
import Link from "./Link.svelte";
import List from "./List.svelte";
import ListItem from "./ListItem.svelte";
import Paragraph from "./Paragraph.svelte";
import Space from "./Space.svelte";
import Strong from "./Strong.svelte";
import Text from "./Text.svelte";

export const renderers = {
	blockquote: Blockquote,
	br: Br,
	code: Code,
	codespan: Codespan,
	em: Em,
	heading: Heading,
	hr: Hr,
	image: Image,
	link: Link,
	list: List,
	listitem: ListItem,
	paragraph: Paragraph,
	space: Space,
	strong: Strong,
	text: Text,
};
