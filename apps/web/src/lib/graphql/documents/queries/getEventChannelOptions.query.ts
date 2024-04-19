import { gql } from "../../__generated__";

export const GET_EVENT_CHANNEL_OPTIONS = gql(`
	query GetEventChannelOptions($guildId: ID!) {
		discordChannels: getAllDiscordTextChannels(guildId: $guildId) {
			...ChannelFragment
		}
		discordVoiceChannels: getAllDiscordVoiceChannels(guildId: $guildId) {
			...ChannelFragment
		}
		discordCategories: getAllDiscordCategories(guildId: $guildId) {
			...ChannelFragment
		}
	}
`);
