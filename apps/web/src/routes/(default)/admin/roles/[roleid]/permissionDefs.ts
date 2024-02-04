import { Permission } from "@frcn/shared";

export const permissionDefs = [
    {
        permission: Permission.Admin,
        name: "Administrator",
        help: "Users with this permission will have every permission and be able to edit any role"
    },
    {
        permission: Permission.CreateEvents,
        name: "Create Events",
        help: "Allows users to create, edit, post and delete events"
    },
    {
        permission: Permission.UploadResources,
        name: "Upload Resources",
        help: "Allows users to create, edit and delete guides & resources"
    },
    {
        permission: Permission.ManageRoles,
        name: "Manage Roles",
        help: "Allows users to modify the roles of other users, create new roles and modify and reorder roles"
    },
    {
        permission: Permission.ManageSystem,
        name: "Manage System",
        help: "Allows users to modify general system settings and event channels"
    },
] satisfies { permission: Permission, name: string, help: string }[]