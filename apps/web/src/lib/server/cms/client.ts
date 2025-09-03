import { CMSContainerType } from "@frcn/cms";

import type { ContentContainerData } from "$lib/cms/transformContainer";
import { createApolloClient, Queries, type TypedApolloClient } from "$lib/graphql";

import { env } from "$env/dynamic/private";

export class CmsClient {
	private apollo: TypedApolloClient;

	constructor({ apollo }: { apollo: TypedApolloClient }) {
		this.apollo = apollo;
	}

	async getIndexes() {
		const { data, error } = await this.apollo.query({
			query: Queries.GET_CONTENT_CONTAINERS_OF_TYPE,
			variables: {
				type: CMSContainerType.Index
			},
			fetchPolicy: "no-cache",
			errorPolicy: "all"
		});

		if (error) {
			console.error(error);
			return [];
		}

		return data?.containers ?? [];
	}

	async getIndex(identifier: string) {
		const { data, error } = await this.apollo.query({
			query: Queries.GET_CONTENT_CONTAINER_WITH_DESCENDANTS,
			variables: {
				identifier,
				type: CMSContainerType.Index
			},
			fetchPolicy: "no-cache",
			errorPolicy: "all"
		});

		if (error) {
			console.error(error);
			return null;
		}

		return data?.container
			? this.transformContainerWithRecursiveChildren(data.container)
			: null;
	}

	async getContainer(id: string) {
		const { data } = await this.apollo.query({
			query: Queries.GET_CONTENT_CONTAINER_BY_ID,
			variables: {
				id
			},
			fetchPolicy: "no-cache"
		});

		return data?.container
			? this.transformContainerWithRecursiveChildren(data.container)
			: null;
	}

	transformContainerWithRecursiveChildren(container: ContentContainerData) {
		if (Object.isFrozen(container)) container = { ...container };
		if (!container.recursiveChildren) return container;

		const children: ContentContainerData[] = [];
		for (const child of container.recursiveChildren) {
			children.push(
				this.transformContainerWithRecursiveChildren(child as ContentContainerData)
			);
		}
		container.children = children;
		delete container.recursiveChildren;
		return container;
	}
}

export function createCmsClient() {
	const apollo = createApolloClient({
		"x-frcn-access-key": String(env.LOCAL_ACCESS_TOKEN)
	});

	return new CmsClient({
		apollo
	});
}
