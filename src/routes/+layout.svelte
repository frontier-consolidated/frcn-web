<script lang="ts">
	import "../app.css";

	import { LogInIcon, SquareArrowOutUpRight } from "lucide-svelte";
	import posthogjs from "posthog-js";
	import {
		onMount,
		type SvelteComponentTyped,
		type Component,
		type ComponentType,
		type Snippet
	} from "svelte";
	import { twMerge } from "tailwind-merge";

	import { browser } from "$app/environment";
	import { afterNavigate, pushState } from "$app/navigation";
	import { page } from "$app/state";
	import { PUBLIC_POSTHOG_KEY } from "$env/static/public";
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

	import type { PageData } from "./$types";

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

	const footerSections: {
		title: string;
		items: (NavItem & { class?: string; Icon?: Component | ComponentType<SvelteComponentTyped> })[];
	}[] = [
		{
			title: "Quick links",
			items: [
				...navItems,
				{ name: "Login to portal", href: `${config.portal}/login`, Icon: SquareArrowOutUpRight }
			]
		},
		{
			title: "Community",
			items: [
				{
					name: "Join our discord",
					href: config.socials.discord,
					class: "text-discord-light/90 hover:text-discord-light",
					Icon: DiscordIcon
				},
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

	let posthogLoaded = $state(false);
	function loadPosthog() {
		posthogLoaded = true;
		posthogjs.init(PUBLIC_POSTHOG_KEY, {
			api_host: "https://prod-events.l3.dev",
			ui_host: "https://eu.i.posthog.com",
			person_profiles: "always",
			capture_exceptions: true,
			disable_surveys: false
		});
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

		if (browser) {
			// TODO: Add consent
			loadPosthog();
		}
	});
</script>

<svelte:head>
	<meta name="robots" content="noindex" />
	<AppSchema />
</svelte:head>

<div class="flex h-full min-h-screen flex-col tracking-[0.07em]">
	<header
		class="bg-background relative z-10 flex h-[100px] w-full [--logo-length:131px] [--logo-offset:calc(var(--logo-length)+6px)] min-[920px]:[--logo-length:301px] lg:[--logo-length:431px]"
	>
		<div
			class="absolute -bottom-[1px] left-(--logo-offset) h-[2px] w-[calc(100%-var(--logo-offset)-750px)] bg-white"
		></div>
		<div
			class="absolute right-0 -bottom-[1px] h-[2px] w-[calc(750px+min(0px,100%-var(--logo-offset)-750px))] bg-linear-to-r from-white to-transparent to-95%"
		></div>
		<div class="absolute top-full left-0 flex h-[21px] w-(--logo-length)">
			<div class="bg-background flex-1"></div>
			<svg
				class="fill-background size-[21px]"
				width="21"
				height="21"
				viewBox="0 0 21 21"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path d="M0 21L21 0H0V21Z" />
			</svg>
			<div
				class="absolute right-[27px] -bottom-[1px] h-[2px] w-full bg-linear-to-l from-white to-transparent to-40%"
			></div>
			<svg
				class="absolute -top-[1px] -right-[6px] h-[23px] w-[33px]"
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
		<div class="relative px-10 pt-[31px] lg:px-20 lg:pt-6">
			<img
				src={logo}
				width="250"
				height="70"
				alt="Frontier Consolidated Logo"
				class="hidden h-[56px] w-[200px] min-[920px]:block lg:h-[70px] lg:w-[250px]"
			/>
			<img
				src={logoEmblem}
				width="56"
				height="56"
				alt="Frontier Consolidated Logo"
				class="size-[56px] min-[920px]:hidden"
			/>
		</div>
		<div class="relative flex flex-1 p-6">
			<nav class="ml-auto flex items-center justify-end gap-8 p-2">
				<NavList items={navItems} class="max-md:hidden" />
				<Button href="{config.portal}/login" size="sm" Icon={LogInIcon} class="whitespace-nowrap">
					Login to portal
				</Button>
			</nav>
		</div>
	</header>
	<main
		class="flex-1 bg-(image:--bg-grid-image) bg-[length:100px] bg-[40px] bg-repeat pb-[692px] bg-blend-overlay"
		style="--bg-grid-image: url({gridTile})"
	>
		{@render children()}
	</main>
	<footer class="relative z-1 flex w-full justify-center">
		<div class="absolute bottom-0 left-0 h-[692px] w-full overflow-hidden">
			<img
				src={footerBackground}
				alt="Argo MOLE on Aberdeen with sun in background"
				class="mask-footer absolute left-1/2 h-[692px] max-w-none -translate-x-1/2 max-[2101px]:bottom-0 min-[2100px]:top-0 min-[2100px]:h-auto min-[2100px]:w-full"
			/>
		</div>
		<div
			class="absolute bottom-8 left-1/2 flex w-full max-w-[1024px] -translate-x-1/2 flex-col gap-8 px-8 sm:bottom-22"
		>
			<div class="flex flex-col gap-x-13 min-[920px]:flex-row">
				<div
					class="flex w-full flex-col items-center gap-6 pt-8 min-[920px]:max-w-[340px] min-[920px]:items-start"
				>
					<div
						class="flex flex-col items-center gap-x-16 gap-y-6 min-[920px]:items-start sm:max-[921px]:flex-row"
					>
						<img
							src={logo}
							width="250"
							height="70"
							alt="Frontier Consolidated logo"
							class="h-[70px] w-[250px]"
						/>
						<span class="text-text-80 max-w-[340px] text-xs font-semibold">
							The 'verse is dark and full of dangers, but you don't have to face the void alone.
							Come with us and explore the possibilities!
						</span>
					</div>
					<span class="text-text-60 text-xs font-medium">
						© {new Date().getFullYear()}
						{config.name} All Rights Reserved.
					</span>
				</div>
				<div
					class="flex flex-1 flex-col justify-center gap-8 pt-8 min-[440px]:flex-row min-[920px]:justify-end min-[920px]:pt-16 sm:gap-16"
				>
					{#each footerSections as section (section.title)}
						<section>
							<h2 class="text-lg font-semibold whitespace-nowrap">{section.title}</h2>
							<ul
								class="mt-4 flex flex-wrap gap-x-8 gap-y-3 min-[440px]:flex-col sm:max-[921px]:flex-row"
							>
								{#each section.items as item (item.href)}
									<li>
										<a
											href={item.href}
											target={item.href.startsWith("http") ? "_blank" : undefined}
											class={twMerge(
												"text-text-80 hover:text-text flex items-center gap-1.5 transition-colors",
												item.class
											)}
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
				class="flex flex-col items-center gap-6 min-[840px]:flex-row min-[840px]:items-end min-[840px]:justify-between"
			>
				<section class="flex w-[340px] items-center gap-2">
					<img
						src={madeByTheCommunity}
						width="64"
						height="64"
						alt="Made by the community"
						class="size-16"
					/>
					<span class="text-xxs text-text-60 font-medium italic">
						This is an unofficial Star Citizen site, not affiliated with the Cloud Imperium group of
						companies. All content on this site not authored by its host or users are property of
						their respective owners.
					</span>
				</section>
				<section class="flex gap-2 text-xs font-medium">
					<a href="/privacy-policy" class="text-text-60 hover:text-text-80 transition-colors">
						Privacy policy
					</a>
					<div class="bg-text-60 h-3.5 w-px"></div>
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
