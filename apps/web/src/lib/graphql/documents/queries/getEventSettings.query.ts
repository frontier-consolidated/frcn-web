import { gql } from "../../__generated__";

export const GET_EVENT_SETTINGS = gql(`
	query GetEventSettings($eventId: ID!, $guildId: ID) {
		event: getEvent(id: $eventId) {
			...EventSettingsFragment
		}
		eventChannels: getAllEventChannels {
			...EventChannelFragment
		}
		customEmojis: getAllDiscordEmojis {
			serverName
			serverAvatar
			emojis {
				id
				name
				image
			}
		}
		discordRoles: getAllDiscordRoles(guildId: $guildId) {
			id
			name
			color
		}
	}
`);
