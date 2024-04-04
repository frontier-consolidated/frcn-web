import { gql } from "../../__generated__";

export const DELETE_EVENT_CHANNEL = gql(`
	mutation DeleteEventChannel($id: Int!, $deleteVoiceChannels: Boolean) {
		deleted: deleteEventChannel(id: $id, deleteVoiceChannels: $deleteVoiceChannels)
	}
`);
