<script lang="ts">
	import { ArrowDownIcon } from "lucide-svelte";

	import type { PageData } from "./$types";
	import Crusader from "./_components/crusader.svelte";
	import tobiiLogo from "./_assets/tobii-logo.png";
	import teamspeakLogo from "./_assets/teamspeak-logo.png";
	import sponsorsGradient from "./_assets/sponsors-gradient.png";

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
<div class="relative mx-auto max-w-[1728px] min-h-[1476px] pt-55 px-6">
	<Crusader />
	<div class="flex justify-center lg:justify-end lg:pr-[5%] xl:pr-[7%] min-[1440px]:pr-[9%]">
		<div class="flex flex-col items-center">
			<section id="hero" class="relative flex flex-col items-center lg:items-start">
				<div class="relative flex flex-col items-end w-fit mr-[118px]">
					<svg
						class="absolute top-1/2 left-[calc(100%-28px)] xl:left-[calc(100%-38px)] w-[128px] xl:w-[158px] -translate-y-1/2"
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
						<span class="text-7xl xl:text-8xl tracking-[0.15em] leading-15 xl:leading-20 font-bold">
							Frontier
						</span>
						<span class="text-2xl xl:text-[2rem] tracking-[0.43em] font-medium">Consolidated</span>
					</h1>
					<span class="text-sm font-medium text-text-40 mt-4 pr-2">
						A Star Citizen Organization</span
					>
				</div>
				<div class="flex flex-col gap-13 max-w-[582px] lg:max-xl:max-w-[466px] mt-32">
					<span class="font-semibold text-text-60 text-wrap">
						The 'verse is dark and full of dangers, but you don't have to face the void alone. Come
						with us and explore the possibilities!
					</span>
					<div class="flex justify-center items-center gap-8 xl:gap-12">
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
				<div class="flex justify-center gap-30">
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

<style>
	.hero-gradient {
		background: linear-gradient(to right, #008fff 48%, #0024da 63%);
		mask-image: radial-gradient(at center, rgba(255, 255, 255, 0.16) 0%, transparent 70%);
	}
</style>
