import path from "path"
import { fileURLToPath } from "url"

import { building } from "$app/environment"
import { CMSEvents } from "@frcn/cms/events"
import type { RequestEvent, ResolveOptions } from "@sveltejs/kit"
import { createEventHandler, createTBus } from "pg-tbus"

import { env } from "$env/dynamic/private"

async function setupCmsEventHandlers() {
    const bus = createTBus("cms", {
        db: { connectionString: env.CMS_BUS_DATABASE_URL },
        schema: env.CMS_BUS_SCHEMA
    })
    
    const cms_update_handler = createEventHandler({
        task_name: "handle_cms_update",
        eventDef: CMSEvents.cms_update_event,
        handler: async (props) => {
            console.log("CMS UPDATE", props)
        }
    })
    
    bus.registerHandler(cms_update_handler)
    
    await bus.start()
}

// if (!building && import.meta.env.PROD) {
//     await setupCmsEventHandlers()
// }

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const prerenderedDir = path.join(__dirname, "../../", "prerendered")
prerenderedDir;

export function createPageProcessor(event: RequestEvent): NonNullable<ResolveOptions["transformPageChunk"]> {
    let buffer = ""
    return function transformPageChunk({ html, done }) {
        buffer += html;
        if (done) {
            if (building || !import.meta.env.PROD || event.isDataRequest) return buffer;

            console.log("page path:", event.url.pathname)

            return buffer;
        }
    }
}