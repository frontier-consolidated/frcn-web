import { CMSEvents } from "@frcn/cms";
import { createTBus } from "pg-tbus";

export async function createCmsEventBus(connectionString: string, schema: string) {
    const bus = createTBus("cms", {
        db: { connectionString },
        schema
    })

    await bus.start()

    setTimeout(() => {
        console.log("Emitting event")
        bus.publish(CMSEvents.cms_update_event.from("Hello world!"))
    }, 2000)

	return bus;
}
