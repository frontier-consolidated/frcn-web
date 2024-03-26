import { createFragmentRegistry } from "@apollo/client/cache";

import { CHANNEL_FRAGMENT } from "./channel.fragment";
import { CONTENT_CONTAINER_FRAGMENT } from "./contentContainer.fragment";
import { CONTENT_CONTAINER_FILE_FRAGMENT } from "./contentContainerFile.fragment";
import { EVENT_FRAGMENT } from "./event.fragment";
import { EVENT_MEMBER_FRAGMENT } from "./eventMember.fragment";
import { EVENT_SETTINGS_FRAGMENT } from "./eventSettings.fragment";
import { RESOURCE_FRAGMENT } from "./resource.fragment";
import { ROLE_FRAGMENT } from "./role.fragment";
import { USER_FRAGMENT } from "./user.fragment";

export const fragments = createFragmentRegistry(
	EVENT_FRAGMENT,
	EVENT_SETTINGS_FRAGMENT,
	EVENT_MEMBER_FRAGMENT,
	CHANNEL_FRAGMENT,
	RESOURCE_FRAGMENT,
	USER_FRAGMENT,
	ROLE_FRAGMENT,
	CONTENT_CONTAINER_FRAGMENT,
	CONTENT_CONTAINER_FILE_FRAGMENT
);
