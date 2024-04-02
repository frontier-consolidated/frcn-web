import { gql } from "../../__generated__";

export const GET_EVENT_SETTINGS = gql(`
	query GetEventSettings($eventId: ID!) {
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
		discordRoles: getAllDiscordRoles {
			id
			name
			color
		}
	}
`);
