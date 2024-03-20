import { gql } from "../../__generated__";

export const GET_SYSTEM_SETTINGS = gql(`
	query GetSystemSettings {
		settings: getSystemSettings {
			discordGuildId
			defaultEventChannel {
				...ChannelFragment
			}
		}
		eventChannels: getAllEventChannels {
			...ChannelFragment
		}
	}
`);
