import { gql } from "../../__generated__";

export const CREATE_EVENT_CHANNEL = gql(`
	mutation CreateEventChannel($guildId: ID! $channelId: ID!, $categoryId: ID!, $existingReadyRoomId: ID) {
		channel: createEventChannel(guildId: $guildId, channelId: $channelId, categoryId: $categoryId, existingReadyRoomId: $existingReadyRoomId) {
			...EventChannelFragment
		}
	}
`);
