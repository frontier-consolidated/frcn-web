<script lang="ts">
	import { ArrowDownIcon, ArrowRightIcon, NotebookPenIcon } from "lucide-svelte";

	import type { PageData } from "./$types";
	import activitiesImage from "./_assets/activities.png";
	import communityImage from "./_assets/community.png";
	import organisationImage from "./_assets/organisation.png";
	import sponsorsGradient from "./_assets/sponsors-gradient.png";
	import teamspeakLogo from "./_assets/teamspeak-logo.png";
	import tobiiLogo from "./_assets/tobii-logo.png";
	import Crusader from "./_components/crusader.svelte";

	import { DiscordIcon, YoutubeIcon } from "$lib/components/icons";
	import Button from "$lib/components/ui/button.svelte";
	import { config } from "$lib/config";
	import Meta from "$lib/seo/meta.svelte";

	let { data }: { data: PageData } = $props();
</script>

<Meta />

<div class="absolute left-0 top-30 w-[99vw] h-screen overflow-hidden z-[-1] hidden lg:block">
	<div class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1728px] h-full">
		<div
			class="absolute top-4 right-100 translate-x-1/2 -rotate-12 w-[1080px] h-[600px] bg-red-500/50 hero-gradient"
		></div>
	</div>
</div>
<div class="relative flex flex-col mx-auto max-w-[1728px] pt-30 sm:pt-55">
	<Crusader />
	<div class="px-8">
		<div class="flex justify-center lg:justify-end lg:pr-[5%] xl:pr-[7%] min-[1440px]:pr-[9%]">
			<div class="flex flex-col items-center">
				<section id="hero" class="relative flex flex-col items-center lg:items-start">
					<div class="relative flex flex-col items-end w-fit sm:mr-[118px]">
						<svg
							class="absolute top-1/2 left-[calc(100%-28px)] xl:left-[calc(100%-38px)] w-[128px] xl:w-[158px] -translate-y-1/2 hidden sm:block"
							width="158"
							height="308"
							viewBox="0 0 158 308"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<line
								x1="3.06066"
								y1="1.93934"
								x2="156.061"
								y2="154.939"
								stroke="white"
								stroke-width="3"
							/>
							<line
								x1="1.93934"
								y1="306.939"
								x2="153.939"
								y2="154.939"
								stroke="white"
								stroke-width="3"
							/>
						</svg>
						<h1 class="flex flex-col items-end">
							<span
								class="text-7xl xl:text-8xl tracking-[0.15em] leading-15 xl:leading-20 font-bold"
							>
								Frontier
							</span>
							<span class="text-2xl xl:text-[2rem] tracking-[0.43em] font-medium">Consolidated</span
							>
						</h1>
						<span class="text-sm font-medium text-text-40 mt-4 pr-2 xl:pr-3">
							A Star Citizen Organization</span
						>
					</div>
					<div class="flex flex-col gap-13 max-w-[582px] lg:max-xl:max-w-[466px] mt-20 sm:mt-32">
						<span class="font-semibold text-text-60 text-wrap">
							The 'verse is dark and full of dangers, but you don't have to face the void alone.
							Come with us and explore the possibilities!
						</span>
						<div
							class="flex justify-center items-center gap-x-8 gap-y-4 max-[520px]:flex-col xl:gap-12"
						>
							<Button
								href={config.socials.discord}
								target="_blank"
								color="discord"
								size="lg"
								Icon={DiscordIcon}>Join our Discord</Button
							>
							<Button
								href="#about-us"
								color="text"
								size="lg"
								Icon={ArrowDownIcon}
								icon-align="right"
								icon-class="size-9"
								nobackground
							>
								Find out more
							</Button>
						</div>
						<div class="flex justify-center items-center gap-12 text-xs">
							<a
								href={config.socials.loudgunsYoutube}
								target="_blank"
								class="flex items-center gap-1.5 text-text-40 hover:text-text-80 transition-colors"
							>
								<YoutubeIcon class="size-5" />
								<span>loudguns</span>
							</a>
							<a
								href={config.socials.frcnYoutube}
								target="_blank"
								class="flex items-center gap-1.5 text-text-40 hover:text-text-80 transition-colors"
							>
								<YoutubeIcon class="size-5" />
								<span>frontierconsolidated</span>
							</a>
						</div>
					</div>
				</section>
				<section
					id="sponsors"
					class="relative flex flex-col items-center gap-8 w-full max-w-[582px] lg:max-xl:max-w-[466px] mt-48 md:mt-60"
				>
					<span class="text-sm font-medium text-text-80">Proudly sponsored by</span>
					<div class="flex justify-center gap-16 sm:gap-30">
						<img
							src={tobiiLogo}
							width="102"
							height="42"
							alt="Tobii logo"
							class="w-[102px] h-[42px]"
						/>
						<img
							src={teamspeakLogo}
							width="195"
							height="52"
							alt="Tobii logo"
							class="w-[195px] h-[52px]"
						/>
					</div>
					<img
						src={sponsorsGradient}
						alt=""
						class="absolute top-full left-1/2 -translate-x-1/2 -translate-y-1/2 w-[102%] md:w-[128%] xl:w-[137%] max-w-none"
					/>
				</section>
			</div>
		</div>
	</div>
	<div id="about-us" class="mt-24 sm:mt-36"></div>
	<section id="community" class="relative flex justify-center pt-12 px-8">
		<img
			src={communityImage}
			alt=""
			class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[130%] object-cover max-w-none z-[-1] mask-community"
		/>
		<div class="flex flex-col gap-4 font-medium text-text-80 max-w-[500px]">
			<h2 class="text-3xl md:text-4xl text-text mb-8">The community</h2>
			<p>
				Star Citizen in its current form is a fantastic game that can deliver hours of gameplay for
				a solo player. Where it really shines right now, though, is as a sandbox to allow people to
				come together. Playing as a group can also really help when the inevitable bugs hit - maybe
				you'll have buddies to pick you up, or at the very least you'll have friends to laugh about
				it with.
			</p>
			<p>
				Just hop on into our Discord and say hello. No need to ask permission to join a
				conversation. If you can see it, you can join it. Just read the room and don't talk over ops
				comms, if one is ongoing.
			</p>
			<div
				class="flex justify-center items-center max-[520px]:flex-col gap-x-8 gap-y-4 xl:gap-12 mt-12"
			>
				<Button
					href={config.socials.discord}
					target="_blank"
					color="discord"
					size="lg"
					Icon={DiscordIcon}>Join our Discord</Button
				>
				<Button
					color="text"
					size="lg"
					Icon={ArrowRightIcon}
					icon-align="right"
					icon-class="size-9"
					nobackground
				>
					Read our rules
				</Button>
			</div>
		</div>
	</section>
	<section
		id="organisation"
		class="relative flex justify-center md:justify-start pt-12 px-8 mt-16 md:mt-26"
	>
		<img
			src={organisationImage}
			alt=""
			class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[130%] object-cover max-w-none z-[-1] mask-organisation"
		/>
		<div class="flex flex-col gap-4 font-medium text-text-80 max-w-[500px] md:ml-20">
			<h2 class="text-3xl md:text-4xl text-text mb-8">Our organisation</h2>
			<p>
				Frontier Consolidated is our Star Citizen organisation and we are actively recruiting new
				members. We cover nearly all areas of the game and are open to everyone once they have got
				the basics of the game down. And if you're not quite there yet, the community is here to
				help you get to that point.
			</p>
			<p>
				While we have grown to a decent size, our goal has always been to keep a small org feel. The
				most important thing for us is that our members actually know each other and play together.
			</p>
			<p>
				Any Frontier Community member can join us, all you need is two references from known and
				have played with. You can hop into a Discord voice channel and say hi at any time, but we
				have plenty of events where we pair up prospects with org members to help you get to know
				people.
			</p>
			<div
				class="flex justify-center items-center max-[520px]:flex-col gap-x-8 gap-y-4 xl:gap-12 mt-12"
			>
				<Button
					href="https://portal.frontierconsolidated.com/applications?id=demo"
					target="_blank"
					size="lg"
					Icon={NotebookPenIcon}
				>
					Apply now
				</Button>
				<Button
					href="/wings"
					color="text"
					size="lg"
					Icon={ArrowRightIcon}
					icon-align="right"
					icon-class="size-9"
					nobackground
				>
					View our wings
				</Button>
			</div>
		</div>
	</section>
	<section
		id="activities"
		class="relative flex justify-center md:justify-end pt-12 px-8 mt-16 md:mt-26 mb-50"
	>
		<img
			src={activitiesImage}
			alt=""
			class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[130%] object-cover max-w-none z-[-1] mask-activities"
		/>
		<div class="flex flex-col gap-4 font-medium text-text-80 max-w-[500px] md:mr-20">
			<h2 class="text-3xl md:text-4xl text-text mb-8">Events and activities</h2>
			<p>
				Frontier Consolidated is our Star Citizen organisation and we are actively recruiting new
				members. We cover nearly all areas of the game and are open to everyone once they have got
				the basics of the game down. And if you're not quite there yet, the community is here to
				help you get to that point.
			</p>
			<p>
				While we have grown to a decent size, our goal has always been to keep a small org feel. The
				most important thing for us is that our members actually know each other and play together.
			</p>
			<p>
				Any Frontier Community member can join us, all you need is two references from known and
				have played with. You can hop into a Discord voice channel and say hi at any time, but we
				have plenty of events where we pair up prospects with org members to help you get to know
				people.
			</p>
		</div>
	</section>
</div>

<style>
	.hero-gradient {
		background: linear-gradient(to right, #008fff 48%, #0024da 63%);
		mask-image: radial-gradient(at center, rgba(255, 255, 255, 0.16) 0%, transparent 70%);
	}

	.mask-community,
	.mask-organisation,
	.mask-activities {
		opacity: 0.35;
		mask-image: linear-gradient(to bottom, transparent 0%, white 5%, white 95%, transparent 100%);
		mask-composite: intersect;
	}

	@media (min-width: theme("screens.md")) {
		.mask-community {
			opacity: 1;
			mask-image:
				linear-gradient(to bottom, transparent 0%, white 20%, white 90%, transparent 100%),
				radial-gradient(at center 40%, rgba(0, 0, 0, 0.2) 30%, white 40%);
		}

		.mask-organisation {
			opacity: 1;
			mask-image: radial-gradient(80% 50% at right, white 70%, transparent 100%);
		}

		.mask-activities {
			opacity: 1;
			mask-image:
				linear-gradient(to bottom, transparent 0%, white 20%, white 90%, transparent 100%),
				linear-gradient(to right, white 40%, rgba(0, 0, 0, 0.3) 55%, transparent 100%);
		}
	}

	@media (min-width: 1728px) {
		.mask-community {
			opacity: 1;
			mask-image:
				linear-gradient(to bottom, transparent 0%, white 20%, white 90%, transparent 100%),
				linear-gradient(to right, transparent 0%, white 5%, white 95%, transparent 100%),
				radial-gradient(at center 40%, rgba(0, 0, 0, 0.2) 30%, white 40%);
		}

		.mask-organisation {
			opacity: 1;
			mask-image:
				radial-gradient(80% 50% at right, white 70%, transparent 100%),
				linear-gradient(to right, white 97%, transparent 100%);
		}

		.mask-activities {
			opacity: 1;
			mask-image:
				linear-gradient(to bottom, transparent 0%, white 20%, white 90%, transparent 100%),
				linear-gradient(
					to right,
					transparent 0%,
					white 5%,
					white 40%,
					rgba(0, 0, 0, 0.3) 55%,
					transparent 100%
				);
		}
	}
</style>
