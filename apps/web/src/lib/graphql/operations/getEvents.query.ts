import { gql } from "../__generated__";

export const GET_EVENTS = gql(`
	query GetEvents($filter: EventFilterInput, $page: Int, $limit: Int) {
		events: getEvents(filter: $filter, page: $page, limit: $limit) {
			items {
				...EventFragment
			}
			page
			nextPage
			prevPage
			total
		}
	}
`);
