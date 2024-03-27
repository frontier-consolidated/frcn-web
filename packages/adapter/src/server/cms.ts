import { CMSEvents } from "@frcn/cms-events"
import { env } from "ENV"
import { createTBus, createEventHandler } from "pg-tbus"

const bus_database_url = env("CMS_BUS_DATABASE_URL", false)
const bus_schema = env("CMS_BUS_SCHEMA", false)

if (!bus_database_url) {
    throw new Error("expected CMS_BUS_DATABASE_URL to be set")
}
if (!bus_schema) {
    throw new Error("expected CMS_BUS_SCHEMA to be set")
}

const bus = createTBus("cms", {
    db: { connectionString: bus_database_url },
    schema: bus_schema
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