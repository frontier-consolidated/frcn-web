import pgtbus from "pg-tbus";
import type * as pgtbusExports from "pg-tbus";
const { defineEvent, Type } = pgtbus as unknown as typeof pgtbusExports

const IndexUpdated = defineEvent({
    event_name: "index_updated",
    schema: Type.String()
})

export const CMSEvents = {
    IndexUpdated
}