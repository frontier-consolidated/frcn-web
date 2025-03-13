import Blockquote from "./blockquote.svelte";
import Br from "./br.svelte";
import Code from "./code.svelte";
import Codespan from "./codespan.svelte";
import Em from "./em.svelte";
import Heading from "./heading.svelte";
import Hr from "./hr.svelte";
import Image from "./image.svelte";
import Link from "./link.svelte";
import ListItem from "./list-item.svelte";
import List from "./list.svelte";
import Paragraph from "./paragraph.svelte";
import Strong from "./strong.svelte";
import Text from "./text.svelte";

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
	// space: Space,
	strong: Strong,
	// table: Table,
	// tablecell: TableCell,
	// tablerow: TableRow,
	text: Text
};
