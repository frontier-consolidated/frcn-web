import { gql } from "../__generated__";

export const GET_RESOURCES = gql(`
	query GetResources($filter: ResourceFilterInput, $page: Int, $limit: Int) {
		resources: getResources(filter: $filter, page: $page, limit: $limit) {
			items {
				...ResourceFragment
			}
			itemsPerPage
			page
			nextPage
			prevPage
			total
		}
	}
`);
