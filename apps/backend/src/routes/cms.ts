import { CMSContainerType } from "@frcn/cms";
import { Permission, hasPermission } from "@frcn/shared";
import type { ContentContainer, FileUpload } from "../__generated__/client";
import { Validator, type Schema } from "jsonschema";

import type { Context, RouteConfig } from "../context";
import { database } from "../database";
import { fileField } from "../middleware/fileField.middleware";
import { $cms } from "../services/cms";
import { $files } from "../services/files";
import { $users } from "../services/users";

type ExportContentContainerFile = {
	key: string;
	identifier?: string;
	fileName: string;
};

type ExportContentContainer = {
	type: string;
	identifier?: string;
	title: string;
	content?: string;
	children: ExportContentContainer[];
	files: ExportContentContainerFile[];
};

type ExportJson = {
	exportedAt: string;
	version: number;
	indexes: ExportContentContainer[];
};

const CMS_EXPORT_VERSION = 1;
const CMS_EXPORT_SCHEMA = {
	type: "object",
	properties: {
		version: {
			type: "integer"
		},
		indexes: {
			type: "array",
			items: {
				$ref: "#/definitions/container"
			}
		}
	},
	required: ["version", "indexes"],
	definitions: {
		container: {
			type: "object",
			properties: {
				type: {
					type: "string"
				},
				identifier: {
					type: "string"
				},
				title: {
					type: "string"
				},
				content: {
					type: "string"
				},
				children: {
					type: "array",
					items: {
						$ref: "#/definitions/container"
					}
				},
				files: {
					type: "array",
					items: {
						type: "object",
						properties: {
							key: {
								type: "string"
							},
							identifier: {
								type: "string"
							},
							fileName: {
								type: "string"
							}
						},
						required: ["key", "fileName"]
					}
				}
			},
			required: ["type", "title", "children", "files"]
		}
	}
} satisfies Schema;

export default function route(context: Context, _config: RouteConfig) {
	const exportValidator = new Validator();

	context.router.get("/cms/export", async (req, res) => {
		if (!req.user) {
			return res.status(401).send({
				message: "Must be authenticated"
			});
		}

		const permissions = await $users.getPermissions(req.user);
		if (!hasPermission(permissions, Permission.CmsRead)) {
			return res.status(403).send({
				message: "Missing permissions"
			});
		}

		const exportDate = new Date();
		const exportJson: ExportJson = {
			exportedAt: exportDate.toISOString(),
			version: CMS_EXPORT_VERSION,
			indexes: []
		};

		const indexes = await database.contentContainer.findMany({
			where: {
				type: CMSContainerType.Index,
				parentId: null
			}
		});

		async function traverseAndExportContainer(
			container: ContentContainer
		): Promise<ExportContentContainer> {
			const children = await $cms.getContainerChildren(container.id);
			const fileLinks = await $cms.getContainerFileLinks(container.id, {
				include: {
					file: true
				}
			});

			const idToIndex = children.reduce(
				(record, child) => ({
					...record,
					[child.id]: container.childrenOrder.findIndex((id) => id === child.id)
				}),
				{} as Record<string, number>
			);
			const exportChildren = await Promise.all(
				[...children]
					.sort((a, b) => idToIndex[a.id] - idToIndex[b.id])
					.map(async (child) => await traverseAndExportContainer(child))
			);

			return {
				type: container.type,
				identifier: container.identifier ?? undefined,
				title: container.title,
				content: container.content ?? undefined,
				children: exportChildren,
				files: fileLinks
					.map((link) => {
						return {
							key: link.file.key,
							identifier: link.identifier ?? undefined,
							fileName: link.file.fileName
						} as ExportContentContainerFile;
					})
					.filter((f): f is ExportContentContainerFile => !!f)
			};
		}

		for (const index of indexes) {
			exportJson.indexes.push(await traverseAndExportContainer(index));
		}

		const result = exportValidator.validate(exportJson, CMS_EXPORT_SCHEMA);
		if (!result.valid) {
			return res.status(500).send({
				message: "Malformed export json created on the server",
				errors: result.errors
			});
		}

		const buffer = Buffer.from(JSON.stringify(exportJson, null, 2));

		res.writeHead(200, {
			"Content-Disposition": `attachment; filename="cms-export-${exportDate.getTime()}.json"`,
			"Content-Type": "application/json",
			"Content-Length": buffer.length
		});
		res.end(buffer);
	});

	context.router.post(
		"/cms/import",
		fileField("export", { maxFiles: 1, disk: false }),
		async (req, res) => {
			const file = (req.files as Express.Multer.File[])[0];

			const exportJson = JSON.parse(file.buffer.toString()) as ExportJson;

			const result = exportValidator.validate(exportJson, CMS_EXPORT_SCHEMA);
			if (!result.valid) {
				return res.status(400).send({
					message: "Malformed export json",
					errors: result.errors
				});
			}

			if (!exportJson.version || exportJson.version !== CMS_EXPORT_VERSION) {
				return res.status(400).send({
					message: `CMS export version mismatch, uploaded file version: '${exportJson.version}', currently supported version: '${CMS_EXPORT_VERSION}'`
				});
			}

			async function createContainerChildrenAndFiles(
				data: ExportContentContainer,
				parentId?: string
			) {
				const container = await database.contentContainer.create({
					data: {
						type: data.type,
						identifier: data.identifier,
						title: data.title,
						content: data.content,
						parent: parentId
							? {
									connect: {
										id: parentId
									}
								}
							: undefined
					}
				});

				const filesOrder: string[] = [];
				for (const file of data.files) {
					const fileUpload = await $files.copyFile(
						context.s3Client,
						context.s3Bucket,
						file.key,
						file.fileName
					);
					if (fileUpload) {
						filesOrder.push(fileUpload.id);
						await database.contentContainer.update({
							where: { id: container.id },
							data: {
								files: {
									create: {
										identifier: file.identifier,
										file: {
											connect: {
												id: fileUpload.id
											}
										}
									}
								}
							}
						});
					}
				}

				const childrenOrder: string[] = [];
				for (const child of data.children) {
					const childContainer = await createContainerChildrenAndFiles(child, container.id);
					childrenOrder.push(childContainer.id);
				}

				await database.contentContainer.update({
					where: { id: container.id },
					data: {
						childrenOrder,
						filesOrder
					}
				});

				return container;
			}

			for (const index of exportJson.indexes) {
				const existingIndex = await database.contentContainer.findFirst({
					where: { identifier: index.identifier!, type: CMSContainerType.Index, parentId: null },
					select: {
						id: true
					}
				});
				let filesToDelete: FileUpload[] = [];
				if (existingIndex) {
					const result = await $cms.deleteContainer(
						context.s3Client,
						context.s3Bucket,
						existingIndex.id,
						false
					);
					filesToDelete = result?.files ?? [];
				}

				await createContainerChildrenAndFiles(index);

				await $files.deleteManyFiles(context.s3Client, context.s3Bucket, filesToDelete);
			}

			res.status(200).send({
				message: "CMS export successfully imported!"
			});
		}
	);
}
