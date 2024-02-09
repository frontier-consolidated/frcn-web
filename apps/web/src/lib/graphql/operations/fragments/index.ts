import { createFragmentRegistry } from "@apollo/client/cache";

import { CHANNEL_FRAGMENT } from "./channel.fragment";
import { EVENT_FRAGMENT } from "./event.fragment";
import { EVENT_MEMBER_FRAGMENT } from "./eventMember.fragment";
import { EVENT_SETTINGS_FRAGMENT } from "./eventSettings.fragment";
import { EVENT_USER_FRAGMENT } from "./eventUser.fragment";
import { RESOURCE_FRAGMENT } from "./resource.fragment";
import { USER_FRAGMENT } from "./user.fragment";

export const fragments = createFragmentRegistry(
	EVENT_FRAGMENT,
	EVENT_SETTINGS_FRAGMENT,
	EVENT_USER_FRAGMENT,
	EVENT_MEMBER_FRAGMENT,
	CHANNEL_FRAGMENT,
	RESOURCE_FRAGMENT,
	USER_FRAGMENT
);
