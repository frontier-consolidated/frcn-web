import { DeleteObjectCommand, type S3Client } from "@aws-sdk/client-s3";
import type { Prisma, User } from "@prisma/client";

import { database, transaction } from "../database";
import type { ResourceCreateInput, ResourceEditInput } from "../graphql/__generated__/resolvers-types";

async function getResource(id: string) {
	const resource = await database.resource.findUnique({
		where: { id },
	});
	return resource;
}

type GetResourcesFilter = {
	search?: string;
	tags?: string[]
};

async function getResources(
	filter: GetResourcesFilter,
	page: number = 0,
	limit: number = -1,
) {
	const { search, tags } = filter;

	if (limit === -1) limit = 20;
	limit = Math.min(100, limit);

	const where: Prisma.ResourceWhereInput = {
		name: search
			? {
				contains: search,
				mode: "insensitive"
				}
			: undefined,
		tags: tags ? {
			hasEvery: tags
		} : undefined,
		fileAttached: true
	}

	const count = await database.resource.count({
		where
	})
	const result = await database.resource.findMany({
		take: limit,
		skip: page * limit,
		where,
		orderBy: [
			{
				updatedAt: "desc",
			},
		]
	});

	return {
		items: result,
		total: count,
		itemsPerPage: limit,
		page,
		nextPage: (page + 1) * limit < count ? page + 1 : null,
		prevPage: page > 0 ? page - 1 : null,
	};
}

async function createResource(owner: User, data: ResourceCreateInput) {
	const resource = await database.resource.create({
		data: {
			owner: {
				connect: {
					id: owner.id
				}
			},
			name: data.name,
			shortDescription: data.shortDescription,
			tags: data.tags,
			canPreview: false,
			fileAttached: false,
		}
	})

	return resource;
}

async function editResource(id: string, data: ResourceEditInput) {
	const resource = await database.resource.findUnique({
		where: { id },
		select: {
			id: true
		}
	})
	if (!resource) return null;

	const updatedResource = await database.resource.update({
		where: { id },
		data: {
			name: data.name ?? undefined,
			shortDescription: data.shortDescription ?? undefined,
			tags: data.tags ?? undefined,
		}
	})

	return updatedResource;
}

async function deleteResource(client: S3Client, bucket: string, id: string) {
	const resource = await database.resource.findUnique({
		where: { id },
		select: {
			id: true,
			fileAttached: true
		}
	})
	if (!resource || !resource.fileAttached) return;

	const command = new DeleteObjectCommand({
		Bucket: bucket,
		Key: resource.id,
	})

	await transaction(async (tx) => {
		await tx.resource.delete({
			where: { id }
		})
	
		await client.send(command)
	})
}

export const $resources = {
	getResource,
	getResources,
	createResource,
	editResource,
	deleteResource
};
