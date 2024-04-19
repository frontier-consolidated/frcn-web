import { gql } from "../../__generated__";

export const GET_ALL_EVENT_CHANNELS = gql(`
	query GetAllEventChannels {
		settings: getSystemSettings {
			discordGuild {
				id
				name
			}
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
		discordGuilds: getAllDiscordGuilds {
			id
			name
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
