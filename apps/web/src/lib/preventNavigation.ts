import { browser } from "$app/environment";
import { get, writable } from "svelte/store";

const attr_name = "data-navigation-prevention";

export default function prevent_navigation(message = "You have unsaved changes! Are you sure you want to leave?") {
    const can_navigate = writable(true);

    function init_navigation(_node: HTMLElement) {
        if (!browser) return;
        function prevent_unload(ev: BeforeUnloadEvent) {
            if (get(can_navigate)) return;
            if (!confirm(message)) {
                ev.preventDefault();
    
                if (ev.type === "beforeunload") {
                    const return_value = "You have unsaved changes! Are you sure you want to leave?";
                    ev.returnValue = return_value;
                    return return_value;
                }
            }
        }

        for (const link of document.querySelectorAll<HTMLAnchorElement>("a[href]")) {
            link.addEventListener("click", prevent_unload);
            link.toggleAttribute(attr_name, true);
        }
        window.addEventListener("beforeunload", prevent_unload);
        
        const observer = new MutationObserver(function (mutations) {
            for (const record of mutations) {
                for (const node of record.addedNodes) {
                    if (node.nodeType !== node.ELEMENT_NODE || (node as Element).tagName !== "A") continue;
                    const element = node as HTMLAnchorElement;
                    if (element.hasAttribute(attr_name)) continue;
                    element.addEventListener("click", prevent_unload);
                    element.toggleAttribute(attr_name, true);
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
                    link.removeEventListener("click", prevent_unload);
                }
                window.removeEventListener("beforeunload", prevent_unload);
                observer.disconnect();
            }
        };
    }

    return { can_navigate, init_navigation };
}