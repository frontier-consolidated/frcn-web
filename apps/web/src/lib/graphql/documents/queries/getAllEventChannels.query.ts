import { gql } from "../../__generated__";

export const GET_ALL_EVENT_CHANNELS = gql(`
	query GetAllEventChannels {
		settings: getSystemSettings {
			defaultEventChannel {
				...EventChannelFragment
			}
		}
		eventChannels: getAllEventChannels {
			...EventChannelFragment
			events {
				id
				state
			}
		}
		discordChannels: getAllDiscordTextChannels {
			...ChannelFragment
		}
		discordVoiceChannels: getAllDiscordVoiceChannels {
			...ChannelFragment
		}
		discordCategories: getAllDiscordCategories {
			...ChannelFragment
		}
	}
`);
