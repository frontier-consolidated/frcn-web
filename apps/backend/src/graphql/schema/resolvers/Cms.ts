import { CMSContainerType, ContainerTypeMap } from "@frcn/cms";
import type { ContentContainer, ContentContainerFile, FileUpload } from "@prisma/client";

import type { WithModel } from "./types";
import { getOrigin } from "../../../env";
import { logger } from "../../../logger";
import { $cms } from "../../../services/cms";
import type {
	ContentContainer as GQLContentContainer,
	ContentContainerFile as GQLContentContainerFile,
	Resolvers
} from "../../__generated__/resolvers-types";
import type { GQLContext } from "../../context";
import { gqlErrorBadInput } from "../gqlError";

export function resolveContentContainer(container: ContentContainer) {
	return {
		_model: container,
		id: container.id,
		identifier: container.identifier,
		type: container.type,
		title: container.title,
		content: container.content,
		files: [], // field-resolved
		children: [], // field-resolved
		recursiveChildren: [] // field-resolved
	} satisfies WithModel<GQLContentContainer, ContentContainer>;
}

export function resolveContentContainerFile(
	link: ContentContainerFile,
	file: FileUpload,
	context: GQLContext
) {
	return {
		id: link.id,
		identifier: link.identifier,
		fileName: file.fileName,
		fileSizeKb: file.fileSizeKb,
		contentType: file.contentType,
		previewUrl: `${getOrigin(context.req.secure ? "https" : "http")}/media/${file.id}/${file.fileName}`
	} satisfies GQLContentContainerFile;
}

export const cmsResolvers: Resolvers = {
	ContentContainer: {
		async files(source, args, context) {
			const { _model } = source as WithModel<GQLContentContainer, ContentContainer>;
			const fileLinks = await $cms.getContainerFileLinks(_model.id, {
				include: {
					file: true
				}
			});

			const resolved = fileLinks
				.map((link) => {
					return resolveContentContainerFile(link, link.file, context);
				})
				.filter((f): f is NonNullable<typeof f> => !!f);

			const idToIndex = resolved.reduce(
				(record, file) => ({
					...record,
					[file.id]: _model.filesOrder.findIndex((id) => id === file.id)
				}),
				{} as Record<string, number>
			);
			resolved.sort((a, b) => idToIndex[a.id] - idToIndex[b.id]);
			return resolved;
		},
		async children(source) {
			const { _model } = source as WithModel<GQLContentContainer, ContentContainer>;
			const children = await $cms.getContainerChildren(_model.id);

			const idToIndex = children.reduce(
				(record, child) => ({
					...record,
					[child.id]: _model.childrenOrder.findIndex((id) => id === child.id)
				}),
				{} as Record<string, number>
			);
			return [...children]
				.sort((a, b) => idToIndex[a.id] - idToIndex[b.id])
				.map(resolveContentContainer);
		},
		async recursiveChildren(source, args, context) {
			const { _model } = source as WithModel<GQLContentContainer, ContentContainer>;

			async function getChildrenRecursive(container: ContentContainer) {
				const children = (await $cms.getContainerChildren(container.id, {
					include: {
						files: {
							include: {
								file: true
							}
						}
					}
				})) as (ContentContainer & { files: (ContentContainerFile & { file: FileUpload })[] })[];

				const resolvedChildren = [];
				for (const child of children) {
					const resolved = resolveContentContainer(child);
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					delete resolved._model;

					const resolvedFiles = child.files
						.map((link) => {
							return resolveContentContainerFile(link, link.file, context);
						})
						.filter((f): f is NonNullable<typeof f> => !!f);

					const idToIndex = resolvedFiles.reduce(
						(record, file) => ({
							...record,
							[file.id]: container.filesOrder.findIndex((id) => id === file.id)
						}),
						{} as Record<string, number>
					);
					resolvedFiles.sort((a, b) => idToIndex[a.id] - idToIndex[b.id]);

					resolved.files = resolvedFiles as never[];
					resolved.recursiveChildren = (await getChildrenRecursive(child)) as never[];
					resolvedChildren.push(resolved);
				}

				const idToIndex = resolvedChildren.reduce(
					(record, child) => ({
						...record,
						[child.id]: container.childrenOrder.findIndex((id) => id === child.id)
					}),
					{} as Record<string, number>
				);
				return [...resolvedChildren].sort((a, b) => idToIndex[a.id] - idToIndex[b.id]);
			}

			const children = await getChildrenRecursive(_model);
			return children;
		},
		async parent(source) {
			const { _model } = source as WithModel<GQLContentContainer, ContentContainer>;
			const parent = await $cms.getContainerParent(_model.id);
			if (!parent) return null;

			return resolveContentContainer(parent);
		}
	},

	Query: {
		async getContentContainer(source, args) {
			const container = await $cms.getContainer(
				args.identifier,
				args.type,
				args.parentId ?? undefined
			);
			if (!container) return null;
			return resolveContentContainer(container);
		},
		async getContentContainerById(source, args) {
			const container = await $cms.getContainerById(args.id);
			if (!container) return null;
			return resolveContentContainer(container);
		},
		async getContentContainersOfType(source, args) {
			const containers = await $cms.getContainersOfType(args.type, args.parentId ?? undefined);
			return containers.map(resolveContentContainer);
		}
	},

	Mutation: {
		async createContentContainer(source, args, context) {
			let parent: ContentContainer | null = null;
			if (args.parent) {
				parent = await $cms.getContainerById(args.parent);
				if (!parent) throw gqlErrorBadInput(`Could not find parent container '${args.parent}'`);

				const ContainerClass = ContainerTypeMap[parent.type as CMSContainerType];
				const container = new ContainerClass({
					id: parent.id,
					title: parent.title
				});

				if (!container.getAllowedChildren().includes(args.type as CMSContainerType)) {
					throw gqlErrorBadInput(
						`Container type '${args.type}' is not allowed as a child of '${parent.type}'`
					);
				}
			}

			if (!Object.values(CMSContainerType).includes(args.type as CMSContainerType)) {
				throw gqlErrorBadInput(`Invalid container type '${args.type}'`);
			}

			logger.audit(context, "created a new ContentContainer", args);
			const container = await $cms.createContainer(
				args.type,
				args.identifier ?? undefined,
				parent ?? undefined
			);
			return resolveContentContainer(container);
		},
		async editContentContainer(source, args, context) {
			const container = await $cms.getContainerById(args.id);
			if (!container) return null;

			logger.audit(context, "updated a ContentContainer", args);
			const updatedContainer = await $cms.editContainer(container, args.data);
			return resolveContentContainer(updatedContainer);
		},
		async reorderContentContainerChildren(source, args, context) {
			const container = await $cms.getContainerById(args.id);
			if (!container) return null;

			if (args.order.length !== container.childrenOrder.length) {
				throw gqlErrorBadInput(
					"Given children order is not the same length as container's children order on server"
				);
			}

			const seen: string[] = [];
			for (const id of args.order) {
				if (seen.includes(id)) {
					throw gqlErrorBadInput(`Duplicate container id in given children order: ${id}`);
				}
				if (!container.childrenOrder.includes(id)) {
					throw gqlErrorBadInput(
						`Container id in given children order not in container's children order on server: ${id}`
					);
				}

				seen.push(id);
			}

			logger.audit(context, "reordered ContentContainer children", args);
			const updatedContainer = await $cms.reorderContainerChildren(container, args.order);
			return resolveContentContainer(updatedContainer);
		},
		async reorderContentContainerFiles(source, args, context) {
			const container = await $cms.getContainerById(args.id);
			if (!container) return null;

			if (args.order.length !== container.filesOrder.length) {
				throw gqlErrorBadInput(
					"Given files order is not the same length as container's files order on server"
				);
			}

			const seen: string[] = [];
			for (const id of args.order) {
				if (seen.includes(id)) {
					throw gqlErrorBadInput(`Duplicate container id in given files order: ${id}`);
				}
				if (!container.filesOrder.includes(id)) {
					throw gqlErrorBadInput(
						`Container id in given files order not in container's files order on server: ${id}`
					);
				}

				seen.push(id);
			}

			logger.audit(context, "reordered ContentContainer files", args);
			const updatedContainer = await $cms.reorderContainerFiles(container, args.order);
			return resolveContentContainer(updatedContainer);
		},
		async deleteContentContainer(source, args, context) {
			const container = await $cms.getContainerById(args.id);
			if (!container) return false;

			logger.audit(context, "deleted ContentContainer", args);
			await $cms.deleteContainer(context.app.s3Client, context.app.s3Bucket, args.id);
			return true;
		},
		async editContentContainerFile(source, args, context) {
			const fileLink = await $cms.getContainerFileLink(args.id);
			if (!fileLink) return null;

			logger.audit(context, "updated ContentContainerFile", args);
			const updatedFileLink = await $cms.editContainerFileLink(fileLink, args.data);
			return resolveContentContainerFile(updatedFileLink, updatedFileLink.file, context);
		},
		async deleteContentContainerFile(source, args, context) {
			const fileLink = await $cms.getContainerFileLink(args.id);
			if (!fileLink) return false;

			logger.audit(context, "deleted ContentContainerFile", args);
			await $cms.deleteContainerFileLink(context.app.s3Client, context.app.s3Bucket, fileLink);
			return true;
		}
	}
};
