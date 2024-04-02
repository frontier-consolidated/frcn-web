import { gql } from "../../__generated__";

export const GET_ALL_EVENT_CHANNELS = gql(`
	query GetAllEventChannels {
		settings: getSystemSettings {
			defaultEventChannel {
				...ChannelFragment
			}
		}
		eventChannels: getAllEventChannels {
			...ChannelFragment
		}
	}
`);
