import { CMSContainerType } from "@frcn/cms";
import { Permission, hasPermission } from "@frcn/shared";
import type { ContentContainer } from "@prisma/client";

import type { Context, RouteConfig } from "../context";
import { database } from "../database";
import { $users } from "../services/users";

type ExportContentContainer = {
    type: string;
    identifier?: string;
    title: string;
    content?: string;
    children: ExportContentContainer[]
}

export default function route(context: Context, _config: RouteConfig) {
    context.expressApp.get("/cms/export", async (req, res) => {
        if (!req.user) {
            return res.status(401).send({
                message: "Must be authenticated"
            })
        }

        const permissions = await $users.getPermissions(req.user)
        if (!hasPermission(permissions, Permission.CmsRead)) {
            return res.status(403).send({
                message: "Missing permissions"
            })
        }

        const exportDate = new Date()
        const exportJson = {
            exportedAt: exportDate.toISOString(),
            version: 1,
            indexes: [] as ExportContentContainer[]
        }

        const indexes = await database.contentContainer.findMany({
            where: {
                type: CMSContainerType.Index,
                parentId: null
            }
        })

        async function traverseAndExportContainer(container: ContentContainer): Promise<ExportContentContainer> {
            const children = await database.contentContainer.getChildren(container)

            const idToIndex = children.reduce((record, child) => ({ ...record, [child.id]: container.childrenOrder.findIndex(id => id === child.id) }), {} as Record<string, number>)
            const exportChildren = await Promise.all([...children].sort((a, b) => idToIndex[a.id] - idToIndex[b.id]).map(async (child) => await traverseAndExportContainer(child)));

            return {
                type: container.type,
                identifier: container.identifier ?? undefined,
                title: container.title,
                content: container.content ?? undefined,
                children: exportChildren
            }
        }

        for (const index of indexes) {
            exportJson.indexes.push(await traverseAndExportContainer(index))
        }

        const buffer = Buffer.from(JSON.stringify(exportJson, null, 2))

        res.writeHead(200, {
            "Content-Disposition": `attachment; filename="cms-export-${exportDate.getTime()}.json"`,
            "Content-Type": "application/json",
            "Content-Length": buffer.length,
        })
        res.end(buffer)
    });
}
