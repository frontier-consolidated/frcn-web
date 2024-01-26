import { gql } from "../__generated__";

export const GET_EVENT_SETTINGS = gql(`
	query GetEventSettings($eventId: ID!) {
		event: getEvent(id: $eventId) {
			...EventSettingsFragment
		}
		eventChannels: getAllEventChannels {
			...ChannelFragment
		}
		customEmojis: getAllDiscordEmojis {
			id
			name
			image
		}
		discordRoles: getAllDiscordRoles {
			id
			name
			color
		}
	}
`);
