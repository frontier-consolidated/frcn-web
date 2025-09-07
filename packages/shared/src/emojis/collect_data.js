import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const url = "https://emzi0767.gl-pages.emzi0767.dev/discord-emoji/discordEmojiMap-canary.min.json";

fetch(url)
	.then((response) => {
		return response.json();
	})
	.then(async (data) => {
		const categories = [];
		const emojis = [];
		for (const emoji of data.emojiDefinitions) {
			if (!categories.includes(emoji.category)) {
				categories.push(emoji.category);
			}

			console.log("fetching svg for " + emoji.primaryName);
			const response = await fetch(emoji.assetUrl);
			let svg = await response.text();
			svg = svg.replace(/<svg.+?>|<\/svg>/g, "");

			if (!svg) console.log("SVG EMPTY");

			emojis.push({
				name: emoji.primaryName,
				names: emoji.names,
				surrogate: emoji.surrogates,
				svg,
				category: emoji.category
			});
		}

		for (const emoji of emojis) {
			if (emoji.name.endsWith("_tone1")) {
				const basename = emoji.name.slice(0, -6);
				// console.log("base:", basename);
				// console.log("tone1:", emoji.name);
				emoji.tone = 1;
				for (const emoji2 of emojis) {
					if (emoji2.tone != undefined) continue;
					if (emoji2.name === basename) {
						emoji2.tone = 0;
					} else {
						for (let t = 2; t <= 5; t++) {
							if (emoji2.name === `${basename}_tone${t}`) {
								emoji2.tone = t;
								// console.log(`tone${t}:`, emoji2.name);
							}
						}
					}
				}
			}
		}

		fs.writeFileSync(
			path.join(__dirname, "emojis.json"),
			JSON.stringify({
				categories,
				emojis
			})
		);
	})
	.catch(console.error);
