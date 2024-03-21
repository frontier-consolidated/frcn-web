import { CMSEvents } from "@frcn/cms-events"
import { createEventHandler, createTBus } from "pg-tbus"

const bus = createTBus("cms", {
    db: { connectionString: process.env.CMS_BUS_DATABASE_URL },
    schema: process.env.CMS_BUS_SCHEMA
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