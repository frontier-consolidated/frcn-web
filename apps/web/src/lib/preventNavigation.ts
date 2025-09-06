import { browser } from "$app/environment";
import { get, writable } from "svelte/store";

const attrName = "data-navigation-prevention";

export default function preventNavigation(
	message = "You have unsaved changes! Are you sure you want to leave?"
) {
	const canNavigate = writable(true);

	function initNavigation(_node: HTMLElement) {
		if (!browser) return;
		function preventUnload(ev: BeforeUnloadEvent) {
			if (get(canNavigate)) return;
			if (!confirm(message)) {
				ev.preventDefault();

				if (ev.type === "beforeunload") {
					const returnValue = "You have unsaved changes! Are you sure you want to leave?";
					ev.returnValue = returnValue;
					return returnValue;
				}
			}
		}

		for (const link of document.querySelectorAll<HTMLAnchorElement>("a[href]")) {
			link.addEventListener("click", preventUnload);
			link.toggleAttribute(attrName, true);
		}
		window.addEventListener("beforeunload", preventUnload);

		const observer = new MutationObserver(function (mutations) {
			for (const record of mutations) {
				for (const node of record.addedNodes) {
					if (node.nodeType !== node.ELEMENT_NODE || (node as Element).tagName !== "A") continue;
					const element = node as HTMLAnchorElement;
					if (element.hasAttribute(attrName)) continue;
					element.addEventListener("click", preventUnload);
					element.toggleAttribute(attrName, true);
				}
			}
		});

		observer.observe(document, {
			attributes: false,
			characterData: false,
			childList: true,
			subtree: true
		});

		return {
			destroy() {
				for (const link of document.querySelectorAll<HTMLAnchorElement>("a[href]")) {
					link.removeEventListener("click", preventUnload);
				}
				window.removeEventListener("beforeunload", preventUnload);
				observer.disconnect();
			}
		};
	}

	return { canNavigate, initNavigation };
}
