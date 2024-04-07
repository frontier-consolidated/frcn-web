import { CMSEvents } from "@frcn/cms-events";
import { createTBus, createEventHandler } from "pg-tbus";

const indexToRoute = {
    "/home": "/",
    "/about/activities": "/about/activities",
    "/about/org": "/about/org",
    "/about/community": "/about/community"
};

async function invalidateRoute(pathname) {
    const handlerPath = "../handler.js";
    const { invalidate_isr_route } = await import(/* @vite-ignore */ handlerPath);
    invalidate_isr_route(pathname);
}

export default async function () {
    const bus_database_url = process.env.CMS_BUS_DATABASE_URL;
    const bus_schema = process.env.CMS_BUS_SCHEMA;

    if (!bus_database_url) {
        throw new Error("expected CMS_BUS_DATABASE_URL to be set");
    }
    if (!bus_schema) {
        throw new Error("expected CMS_BUS_SCHEMA to be set");
    }

    const bus = createTBus("cms", {
        db: { connectionString: bus_database_url },
        schema: bus_schema
    });

    bus.registerHandler(createEventHandler({
        task_name: "handle_index_updated",
        eventDef: CMSEvents.IndexUpdated,
        handler: async (props) => {
            console.log("CMS UPDATE", props);
            const pathname = indexToRoute[props.input];
            if (!pathname) return;

            invalidateRoute(pathname);
        }
    }));

    await bus.start();
}