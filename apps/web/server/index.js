import { CMSEvents } from "@frcn/cms-events"
import { createTBus, createEventHandler } from "pg-tbus"

async function invalidateRoute(pathname) {
    const handlerPath = "../handler.js"
    const { invalidate_isr_route } = await import(/* @vite-ignore */ handlerPath)
    invalidate_isr_route(pathname);
}

export default async function () {
    const bus_database_url = process.env.CMS_BUS_DATABASE_URL
    const bus_schema = process.env.CMS_BUS_SCHEMA

    if (!bus_database_url) {
        throw new Error("expected CMS_BUS_DATABASE_URL to be set")
    }
    if (!bus_schema) {
        throw new Error("expected CMS_BUS_SCHEMA to be set")
    }

    console.log("CMS Database:", bus_database_url)
    console.log("CMS Event Schema:", bus_schema)


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

    console.log("server start!")

    setTimeout(() => {
        invalidateRoute("/")
    }, 5000)
}