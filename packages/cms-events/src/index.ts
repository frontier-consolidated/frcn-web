import { defineEvent, Type } from "pg-tbus";

const cms_update_event = defineEvent({
    event_name: "cms_update",
    schema: Type.String()
})

export const CMSEvents = {
    cms_update_event
}