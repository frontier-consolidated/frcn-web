import type { Resource, User } from "@prisma/client";

import type { WithModel } from "./types";
import { resolveUser } from "./User";
import { database } from "../../../database";
import { getOrigin } from "../../../env";
import { $resources } from "../../../services/resources";
import type {
	User as GQLUser,
	Resource as GQLResource,
	Resolvers,
} from "../../__generated__/resolvers-types";
import { gqlErrorUnauthenticated } from "../gqlError";

export function resolveResource(resource: Resource) {
	return {
		_model: resource,
		id: resource.id,
		owner: null, // field-resolved
		name: resource.name,
		sizeKb: 0, // field-resolved
		shortDescription: resource.shortDescription,
		previewUrl: null, // field-resolved
		downloadUrl: null, // field-resolved
		tags: resource.tags,
		updatedAt: resource.updatedAt,
		createdAt: resource.createdAt
	} satisfies WithModel<GQLResource, Resource>;
}

export const resourceResolvers: Resolvers = {
	Resource: {
		async owner(source): Promise<WithModel<GQLUser, User> | null> {
			const { _model } = source as WithModel<GQLResource, Resource>;
			const owner = await database.resource.getOwner(_model);
			if (!owner) return null;
			return resolveUser(owner);
		},
		async sizeKb(source) {
			const { _model } = source as WithModel<GQLResource, Resource>;
			const file = await database.resource.getFile(_model)
			if (!file) return 0;
			return file.fileSizeKb;
		},
		async previewUrl(source, args, context) {
			const { _model } = source as WithModel<GQLResource, Resource>;
			if (!_model.canPreview) return null;
			const file = await database.resource.getFile(_model)
			if (!file) return null;
			return `${getOrigin(context.req.secure ? "https" : "http")}/media/${file.id}/${file.fileName}`;
		},
		async downloadUrl(source, args, context) {
			const { _model } = source as WithModel<GQLResource, Resource>;
			const file = await database.resource.getFile(_model)
			if (!file) return null;
			return `${getOrigin(context.req.secure ? "https" : "http")}/media/${file.id}/${file.fileName}?download`;
		}
	},

	Query: {
		async getResource(source, { id }) {
			const resource = await $resources.getResource(id);
			if (!resource) return null;

			return resolveResource(resource)
		},
		async getResources(source, { filter, page, limit }) {
			const { search, tags } = filter ?? {};

			const result = await $resources.getResources(
				{
					search: search ?? undefined,
					tags: tags ?? undefined,
				},
				page ?? undefined,
				limit ?? undefined
			);

			return {
				items: result.items.map(resolveResource),
				itemsPerPage: result.itemsPerPage,
				page: result.page,
				nextPage: result.nextPage,
				prevPage: result.prevPage,
				total: result.total,
			};
		},
	},

	Mutation: {
		async createResource(source, args, context) {
			if (!context.user) throw gqlErrorUnauthenticated();

			const resource = await $resources.createResource(context.user, args.data)
			return resolveResource(resource)
		},
		async editResource(source, args) {
			const resource = await database.resource.findUnique({
				where: { id: args.id },
				select: {
					id: true
				}
			})
			if (!resource) return null;

			const updatedResource = await $resources.editResource(args.id, args.data)
			if (!updatedResource) return null;
			return resolveResource(updatedResource)
		},
		async deleteResource(source, args, context) {
			const resource = await database.resource.findUnique({
				where: { id: args.id },
				select: {
					id: true
				}
			})
			if (!resource) return false;

			await $resources.deleteResource(context.app.s3Client, context.app.s3Bucket, resource.id);
			return true;
		}
	}
};
