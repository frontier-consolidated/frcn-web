import pgtbus from "pg-tbus";
import type * as pgtbusExports from "pg-tbus";
const { defineEvent, Type } = pgtbus as unknown as typeof pgtbusExports

const cms_update_event = defineEvent({
    event_name: "cms_update",
    schema: Type.String()
})

export const CMSEvents = {
    cms_update_event
}