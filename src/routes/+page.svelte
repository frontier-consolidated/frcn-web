<script lang="ts">
	import { ArrowDownIcon, ArrowRightIcon, NotebookPenIcon } from "lucide-svelte";

	import { DiscordIcon, YoutubeIcon } from "$lib/components/icons";
	import Button from "$lib/components/ui/button.svelte";
	import { config } from "$lib/config";
	import Meta from "$lib/seo/meta.svelte";

	import type { PageData } from "./$types";
	import activitiesImage from "./_assets/activities.png";
	import communityImage from "./_assets/community.png";
	import organisationImage from "./_assets/organisation.png";
	import sponsorsGradient from "./_assets/sponsors-gradient.png";
	import teamspeakLogo from "./_assets/teamspeak-logo.png";
	import tobiiLogo from "./_assets/tobii-logo.png";
	import Crusader from "./_components/crusader.svelte";

	let { data }: { data: PageData } = $props();
</script>

<Meta />

<div class="absolute top-30 left-0 z-[-1] hidden h-screen w-[99vw] overflow-hidden lg:block">
	<div class="max-w-page absolute top-0 left-1/2 h-full w-full -translate-x-1/2">
		<div
			class="hero-gradient absolute top-4 right-100 h-[600px] w-[1080px] translate-x-1/2 -rotate-12 bg-red-500/50"
		></div>
	</div>
</div>
<div class="max-w-page relative mx-auto flex flex-col pt-30 sm:pt-55">
	<Crusader />
	<div class="px-8">
		<div class="flex justify-center min-[1440px]:pr-[9%] lg:justify-end lg:pr-[5%] xl:pr-[7%]">
			<div class="flex flex-col items-center">
				<section id="hero" class="relative flex flex-col items-center lg:items-start">
					<div class="relative flex w-fit flex-col items-end sm:mr-[118px]">
						<svg
							class="absolute top-1/2 left-[calc(100%-28px)] hidden w-[128px] -translate-y-1/2 sm:block xl:left-[calc(100%-38px)] xl:w-[158px]"
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
								class="text-7xl leading-15 font-bold tracking-[0.15em] xl:text-8xl xl:leading-20"
							>
								Frontier
							</span>
							<span class="text-2xl font-medium tracking-[0.43em] xl:text-[2rem]">Consolidated</span
							>
						</h1>
						<span class="text-text-40 mt-4 pr-2 text-sm font-medium xl:pr-3">
							A Star Citizen Organization</span
						>
					</div>
					<div class="mt-20 flex max-w-[582px] flex-col gap-13 sm:mt-32 lg:max-xl:max-w-[466px]">
						<span class="text-text-60 font-semibold text-wrap">
							The 'verse is dark and full of dangers, but you don't have to face the void alone.
							Come with us and explore the possibilities!
						</span>
						<div
							class="flex items-center justify-center gap-x-8 gap-y-4 max-[520px]:flex-col xl:gap-12"
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
						<div class="flex items-center justify-center gap-12 text-xs">
							<a
								href={config.socials.loudgunsYoutube}
								target="_blank"
								class="text-text-40 hover:text-text-80 flex items-center gap-1.5 transition-colors"
							>
								<YoutubeIcon class="size-5" />
								<span>loudguns</span>
							</a>
							<a
								href={config.socials.frcnYoutube}
								target="_blank"
								class="text-text-40 hover:text-text-80 flex items-center gap-1.5 transition-colors"
							>
								<YoutubeIcon class="size-5" />
								<span>frontierconsolidated</span>
							</a>
						</div>
					</div>
				</section>
				<section
					id="sponsors"
					class="relative mt-48 flex w-full max-w-[582px] flex-col items-center gap-8 md:mt-60 lg:max-xl:max-w-[466px]"
				>
					<span class="text-text-80 text-sm font-medium">Proudly sponsored by</span>
					<div class="flex justify-center gap-16 sm:gap-30">
						<img
							src={tobiiLogo}
							width="102"
							height="42"
							alt="Tobii logo"
							class="h-[42px] w-[102px]"
						/>
						<img
							src={teamspeakLogo}
							width="195"
							height="52"
							alt="Tobii logo"
							class="h-[52px] w-[195px]"
						/>
					</div>
					<img
						src={sponsorsGradient}
						alt=""
						class="absolute top-full left-1/2 w-[102%] max-w-none -translate-x-1/2 -translate-y-1/2 md:w-[128%] xl:w-[137%]"
					/>
				</section>
			</div>
		</div>
	</div>
	<div id="about-us" class="mt-24 sm:mt-36"></div>
	<section id="community" class="relative flex justify-center px-8 pt-12">
		<img
			src={communityImage}
			alt=""
			class="mask-community absolute top-0 left-1/2 z-[-1] h-[130%] w-full max-w-none -translate-x-1/2 object-cover"
		/>
		<div class="text-text-80 flex max-w-[500px] flex-col gap-4 font-medium">
			<h2 class="text-text mb-8 text-3xl md:text-4xl">The community</h2>
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
				class="mt-12 flex items-center justify-center gap-x-8 gap-y-4 max-[520px]:flex-col xl:gap-12"
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
		class="relative mt-16 flex justify-center px-8 pt-12 md:mt-26 md:justify-start"
	>
		<img
			src={organisationImage}
			alt=""
			class="mask-organisation absolute top-0 left-1/2 z-[-1] h-[130%] w-full max-w-none -translate-x-1/2 object-cover"
		/>
		<div class="text-text-80 flex max-w-[500px] flex-col gap-4 font-medium md:ml-20">
			<h2 class="text-text mb-8 text-3xl md:text-4xl">Our organisation</h2>
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
				class="mt-12 flex items-center justify-center gap-x-8 gap-y-4 max-[520px]:flex-col xl:gap-12"
			>
				<Button
					href="{config.portal}/applications?id=demo"
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
		class="relative mt-16 mb-50 flex justify-center px-8 pt-12 md:mt-26 md:justify-end"
	>
		<img
			src={activitiesImage}
			alt=""
			class="mask-activities absolute top-0 left-1/2 z-[-1] h-[130%] w-full max-w-none -translate-x-1/2 object-cover"
		/>
		<div class="text-text-80 flex max-w-[500px] flex-col gap-4 font-medium md:mr-20">
			<h2 class="text-text mb-8 text-3xl md:text-4xl">Events and activities</h2>
			<p>
				The 'verse is dark and full of dangers, but also full of fun to be had with a group of
				players, large or small. Star Citizen is made to be played with others and has a vast scope
				of opportunities for gameplay beyond the solo player.
			</p>
			<p>
				While it's easy to gather a friend or two for some quality time exploring the 'verse,
				crewing up for a larger ship or complex operation can be more demanding and requires skills
				in coordination, logistics and all types of combat. That's why we run weekly community and
				org events for all areas of the game, to open up the large gameplay opportunities to
				everyone!
			</p>
			<div class="mt-8 flex items-center justify-center md:justify-end md:pr-6">
				<Button
					href="{config.portal}/events"
					color="text"
					size="lg"
					Icon={ArrowRightIcon}
					icon-align="right"
					icon-class="size-9"
					nobackground
				>
					Browse upcoming events
				</Button>
			</div>
		</div>
	</section>
</div>

<style lang="postcss">
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

	@media (min-width: theme("screens.lg")) {
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

	@media (min-width: 108rem) {
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
