import { gql } from "../../__generated__";

export const ARCHIVE_EVENT = gql(`
	mutation ArchiveEvent($id: ID!) {
		archived: archiveEvent(id: $id)
	}
`);
