// import icon from "$lib/assets/logo-icon.png";
// import image from "$lib/assets/share-image.png";
import type { SoftwareApplication } from "schema-dts";

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
		youtube: "https://www.youtube.com/@LoudGuns",
		github: "https://github.com/frontier-consolidated",
		merch: "https://loudguns.teemill.com"
	},
	meta: {
		icon: null,
		image: null,
		color: "#2DB24A",
		twitter_handle: "@LoudGunsGaming",
		publish_date: "2024-03-04",
		// https://developers.google.com/search/docs/appearance/structured-data/software-app#softwareapplication
		app_category: "UtilitiesApplication",
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
