
import { CMSEvents } from "@frcn/cms/events"
import { createEventHandler, createTBus } from "pg-tbus"

import { CMS_BUS_SCHEMA, CMS_BUS_DATABASE_URL } from "$env/static/private"

async function setupCmsEventHandlers() {
    const bus = createTBus("cms", {
        db: { connectionString: CMS_BUS_DATABASE_URL },
        schema: CMS_BUS_SCHEMA
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

if (import.meta.env.PROD) {
    await setupCmsEventHandlers()
}