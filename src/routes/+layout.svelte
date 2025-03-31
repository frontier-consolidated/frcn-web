<script lang="ts">
	import "../app.css";

	import { LogInIcon } from "lucide-svelte";
	import { onMount, type Component, type Snippet } from "svelte";

	import type { PageData } from "./$types";

	import { afterNavigate, pushState } from "$app/navigation";
	import { page } from "$app/state";
	import logoEmblem from "$lib/assets/emblem.png";
	import footerBackground from "$lib/assets/footer-background.png";
	import gridTile from "$lib/assets/grid-rotated.png";
	import logo from "$lib/assets/logo.png";
	import madeByTheCommunity from "$lib/assets/made-by-the-community.png";
	import { DiscordIcon, GithubIcon, YoutubeIcon } from "$lib/components/icons";
	import type { NavItem } from "$lib/components/nav-list/nav-list.svelte";
	import NavList from "$lib/components/nav-list/nav-list.svelte";
	import Button from "$lib/components/ui/button.svelte";
	import { config } from "$lib/config";
	import { AppSchema } from "$lib/seo/schema";

	let { data, children }: { data: PageData; children: Snippet } = $props();

	const navItems: NavItem[] = [
		{ name: "Home", href: "/", isActive: (url) => url.pathname === "/" && url.hash.length < 2 },
		{
			name: "About Us",
			href: "/#about-us",
			isActive: (url) => url.pathname === "/" && url.hash === "#about-us"
		},
		{ name: "Gallery", href: "/gallery" },
		{ name: "Tools", href: "/tools" },
		{ name: "Guides & Resources", href: "/guides-and-resources" },
		{ name: "Wings", href: "/wings" }
	];

	const footerSections: { title: string; items: (NavItem & { Icon?: Component })[] }[] = [
		{
			title: "Quick links",
			items: [...navItems]
		},
		{
			title: "Community",
			items: [
				{ name: "Join our discord", href: config.socials.discord, Icon: DiscordIcon },
				{ name: "loudguns", href: config.socials.loudgunsYoutube, Icon: YoutubeIcon },
				{ name: "frontierconsolidated", href: config.socials.frcnYoutube, Icon: YoutubeIcon },
				{ name: "Github", href: config.socials.github, Icon: GithubIcon }
			]
		}
	];

	function smoothScrollToHash(url: URL) {
		if (!url.hash || url.hash.length < 2) {
			return;
		}

		const id = url.hash.slice(1);
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	}

	afterNavigate(({ to }) => {
		if (to) {
			smoothScrollToHash(to?.url);
		}
	});

	onMount(() => {
		for (const a of document.querySelectorAll<HTMLAnchorElement>("a[href^='#'], a[href^='/#']")) {
			a.addEventListener("click", (e) => {
				const url = new URL(a.href);
				if (page.url.pathname !== url.pathname) {
					return;
				}

				e.preventDefault();
				pushState(a.href, page.state);
				smoothScrollToHash(url);
			});
		}
	});
</script>

<svelte:head>
	<!-- <script
		defer
		data-domain={config.domain}
		src="https://plausible.io/js/script.tagged-events.js"
	></script> -->
	<meta name="robots" content="noindex" />
	<AppSchema />
</svelte:head>

<div class="flex flex-col h-full min-h-screen tracking-[0.07em]">
	<header
		class="relative flex w-full h-[100px] bg-background z-10 [--logo-length:131px] min-[920px]:[--logo-length:301px] lg:[--logo-length:431px] [--logo-offset:calc(var(--logo-length)+6px)]"
	>
		<div
			class="absolute -bottom-[1px] left-(--logo-offset) w-[calc(100%-var(--logo-offset)-750px)] h-[2px] bg-white"
		></div>
		<div
			class="absolute -bottom-[1px] right-0 w-[calc(750px+min(0px,100%-var(--logo-offset)-750px))] h-[2px] bg-linear-to-r from-white to-transparent to-95%"
		></div>
		<div class="absolute top-full left-0 w-(--logo-length) h-[21px] flex">
			<div class="flex-1 bg-background"></div>
			<svg
				class="size-[21px] fill-background"
				width="21"
				height="21"
				viewBox="0 0 21 21"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path d="M0 21L21 0H0V21Z" />
			</svg>
			<div
				class="absolute -bottom-[1px] right-[27px] w-full h-[2px] bg-linear-to-l from-white to-transparent to-40%"
			></div>
			<svg
				class="absolute -top-[1px] -right-[6px] w-[33px] h-[23px]"
				width="33"
				height="23"
				viewBox="0 0 33 23"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M0 22H3.51472C5.10602 22 6.63214 21.3679 7.75736 20.2426L25.2426 2.75736C26.3679 1.63214 27.894 1 29.4853 1H33"
					stroke="white"
					stroke-width="2"
				/>
			</svg>
		</div>
		<div class="relative px-10 lg:px-20 pt-[31px] lg:pt-6">
			<img
				src={logo}
				width="250"
				height="70"
				alt="Frontier Consolidated Logo"
				class="w-[200px] h-[56px] lg:w-[250px] lg:h-[70px] hidden min-[920px]:block"
			/>
			<img
				src={logoEmblem}
				width="56"
				height="56"
				alt="Frontier Consolidated Logo"
				class="size-[56px] min-[920px]:hidden"
			/>
		</div>
		<div class="relative flex-1 flex p-6">
			<nav class="flex justify-end items-center gap-8 p-2 ml-auto">
				<NavList items={navItems} class="max-md:hidden" />
				<Button
					href="https://scorgportal.com/login?orgId=demo"
					size="sm"
					Icon={LogInIcon}
					class="whitespace-nowrap"
				>
					Login to portal
				</Button>
			</nav>
		</div>
	</header>
	<main
		class="flex-1 pb-[692px] bg-(image:--bg-grid-image) bg-blend-overlay bg-[length:100px] bg-[40px] bg-repeat"
		style="--bg-grid-image: url({gridTile})"
	>
		{@render children()}
	</main>
	<footer class="relative flex justify-center w-full z-1">
		<div class="absolute bottom-0 left-0 w-full h-[692px] overflow-hidden">
			<img
				src={footerBackground}
				alt="Argo MOLE on Aberdeen with sun in background"
				class="absolute max-[2101px]:bottom-0 min-[2100px]:top-0 left-1/2 -translate-x-1/2 max-w-none h-[692px] min-[2100px]:h-auto min-[2100px]:w-full mask-footer"
			/>
		</div>
		<div
			class="absolute bottom-8 sm:bottom-22 left-1/2 -translate-x-1/2 flex flex-col gap-8 w-full max-w-[1024px] px-8"
		>
			<div class="flex flex-col min-[920px]:flex-row gap-x-13">
				<div
					class="flex flex-col items-center min-[920px]:items-start gap-6 w-full min-[920px]:max-w-[340px] pt-8"
				>
					<div
						class="flex items-center min-[920px]:items-start flex-col sm:max-[921px]:flex-row gap-x-16 gap-y-6"
					>
						<img
							src={logo}
							width="250"
							height="70"
							alt="Frontier Consolidated logo"
							class="w-[250px] h-[70px]"
						/>
						<span class="text-xs font-semibold text-text-80 max-w-[340px]">
							The 'verse is dark and full of dangers, but you don't have to face the void alone.
							Come with us and explore the possibilities!
						</span>
					</div>
					<span class="text-xs font-medium text-text-60">
						© {new Date().getFullYear()}
						{config.name} All Rights Reserved.
					</span>
				</div>
				<div
					class="flex-1 flex justify-center min-[920px]:justify-end gap-8 sm:gap-16 pt-8 min-[920px]:pt-16"
				>
					{#each footerSections as section (section.title)}
						<section>
							<h2 class="text-lg font-semibold whitespace-nowrap">{section.title}</h2>
							<ul class="flex flex-wrap sm:max-[921px]:flex-row flex-col gap-x-8 gap-y-3 mt-4">
								{#each section.items as item (item.href)}
									<li>
										<a
											href={item.href}
											target={item.href.startsWith("http") ? "_blank" : undefined}
											class="flex items-center gap-1.5 text-text-80 hover:text-text transition-colors"
										>
											{#if item.Icon}
												<item.Icon class="size-4" />
											{/if}
											<span class="text-sm font-medium">{item.name}</span>
										</a>
									</li>
								{/each}
							</ul>
						</section>
					{/each}
				</div>
			</div>
			<div
				class="flex flex-col min-[840px]:flex-row min-[840px]:justify-between items-center min-[840px]:items-end gap-6"
			>
				<section class="flex items-center gap-2 w-[340px]">
					<img
						src={madeByTheCommunity}
						width="64"
						height="64"
						alt="Made by the community"
						class="size-16"
					/>
					<span class="text-xxs font-medium italic text-text-60">
						This is an unofficial Star Citizen site, not affiliated with the Cloud Imperium group of
						companies. All content on this site not authored by its host or users are property of
						their respective owners.
					</span>
				</section>
				<section class="flex gap-2 text-xs font-medium">
					<a href="/terms-and-conditions" class="text-text-60 hover:text-text-80 transition-colors">
						Terms and conditions
					</a>
					<div class="w-px h-3.5 bg-text-60"></div>
					<a href="/privacy-policy" class="text-text-60 hover:text-text-80 transition-colors">
						Privacy policy
					</a>
					<div class="w-px h-3.5 bg-text-60"></div>
					<a href="/cookie-policy" class="text-text-60 hover:text-text-80 transition-colors">
						Cookie policy
					</a>
				</section>
			</div>
		</div>
	</footer>
</div>

<style>
	.mask-footer {
		filter: brightness(0.65);
		mask-image: radial-gradient(at 50% 73%, rgba(0, 0, 0, 1) 35%, transparent 70%);
		mask-size: 136% 147%;
		mask-origin: border-box;
		mask-position: top;
	}
</style>
