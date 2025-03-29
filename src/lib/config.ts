import type { SoftwareApplication } from "schema-dts";

import icon from "$lib/assets/emblem.png";
// import image from "$lib/assets/share-image.png";

type CreatorType<T = SoftwareApplication["author"]> = T extends { "@type": string } ? T : never;

export const config = {
	name: "Frontier Consolidated",
	domain: "frontierconsolidated.com",
	creator: {
		"@type": "Person",
		name: "@l3dotdev",
		url: "https://github.com/l3dotdev"
	} satisfies CreatorType,
	socials: {
		discord: "https://discord.gg/frcn",
		loudgunsYoutube: "https://www.youtube.com/@LoudGuns",
		frcnYoutube: "https://www.youtube.com/@frontierconsolidated",
		github: "https://github.com/frontier-consolidated",
		merch: "https://loudguns.teemill.com"
	},
	meta: {
		icon,
		image: null,
		color: "#2DB24A",
		twitterHandle: "@LoudGunsGaming",
		publishDate: "2024-03-04",
		// https://developers.google.com/search/docs/appearance/structured-data/software-app#softwareapplication
		appCategory: "UtilitiesApplication",
		description:
			"The official website of the Frontier Consolidated Star Citizen community and organisation.",
		keywords: [
			"Frontier Consolidated",
			"Frontier Consolidated Star Citizen",
			"FRCN",
			"Frontier",
			"Loud Guns",
			"LoudGuns",
			"Loud Guns Organisation",
			"LoudGuns Organisation",
			"Star Citizen FRCN",
			"FRCN Star Citizen"
		]
	}
};
