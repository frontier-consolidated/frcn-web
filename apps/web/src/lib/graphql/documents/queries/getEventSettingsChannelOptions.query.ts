import { gql } from "../../__generated__";

export const GET_EVENT_SETTINGS_CHANNEL_OPTIONS = gql(`
	query GetEventSettingsChannelOptions($guildId: ID!) {
		discordRoles: getAllDiscordRoles(guildId: $guildId) {
			id
			name
			color
		}
	}
`);
