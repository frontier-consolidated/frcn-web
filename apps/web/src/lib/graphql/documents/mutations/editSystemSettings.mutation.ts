import { gql } from "../../__generated__";

export const EDIT_SYSTEM_SETTINGS = gql(`
	mutation EditSystemSettings($data: SystemEditInput!) {
		settings: editSystemSettings(data: $data) {
			discordGuildId
			defaultEventChannel {
				...ChannelFragment
			}
		}
	}
`);
