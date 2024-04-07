import { createTBus } from "pg-tbus";

export async function createCmsEventBus(connectionString: string, schema: string) {
    const bus = createTBus("cms", {
        db: { connectionString },
        schema
    });

    await bus.start();

	return bus;
}
