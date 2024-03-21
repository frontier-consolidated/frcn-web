import createTBus, { defineEvent, Type } from "pg-tbus";

const cms_update_event = defineEvent({
    event_name: "cms_update",
    schema: Type.String()
})

export function createCmsEventBus(connectionString: string, schema: string) {
    const bus = createTBus("cms", {
        db: { connectionString },
        schema
    })

	return bus;
}
