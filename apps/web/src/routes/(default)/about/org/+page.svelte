<script lang="ts">
	import { Heading } from "flowbite-svelte";

	import Hr from "$lib/components/Hr.svelte";
	import image1 from "$lib/images/stock/carousel/1.png"
	import placeholder from "$lib/images/stock/placeholder.jpg"

	import HeroImg from "../HeroImg.svelte";
	import HeroTitle from "../HeroTitle.svelte";
</script>

<svelte:head>
	<title>About - Our Organisation</title>
</svelte:head>

<Heading tag="h1" class="font-medium text-4xl">Frontier Organisation</Heading>
<p class="text-gray-400">Be a part of something great</p>
<Hr />
<section class="mt-2 flex flex-col gap-8">
	<HeroImg
		src={image1}
		position="bottom-left"
	>
		<HeroTitle>Welcome to the Org!</HeroTitle>
		<p>
			Frontier Consolidated is our SC Organisation and we are actively recruiting new members. We cover nearly all areas of the game and are open to everyone once you’ve got the basics of the game down (the community is here to help you get to that point)!
		</p>
	</HeroImg>
	<HeroImg
		src={placeholder}
	>
		<HeroTitle>What areas of the game do you cover?</HeroTitle>
		<p>
			Much like in the Frontier Community – Frontier Consolidated aims to be a broad church covering a wide array of gameplay. We think that by mixing players who love different areas of the game – Industry, Combat, Logistics, Support, Exploration, Racing etc – that we can create an Org which supports and compliments one another.
		</p>
		<p>
			Just like in the Community though we don’t do piracy – it’s still early days for SC but we think that already player Orgs are developing reputations, and we don’t want ours to be interwoven with holding other players up at gunpoint!
		</p>
	</HeroImg>
	<HeroImg
		src={placeholder}
		position="bottom-left"
	>
		<HeroTitle>How do I join?</HeroTitle>
		<p>
			While we have grown to a decent size our goal has always been to keep a small org feel, the most important thing for us is that our members actually know each other and play together.
		</p>
		<p>
			Frontier Community members can flag themselves as a Prospect in the discord, and from that point you’ll just need to get 2 references from Org Members – you can hop into a VC and say hi at any time but we have plenty of events where we’ll specifically pair up Prospects with Org Members to help you out!
		</p>
	</HeroImg>
	<HeroImg
		src={placeholder}
	>
		<HeroTitle>How seriously do you take the game?</HeroTitle>
		<p>
			Overall we would describe ourselves as “Filthy Casuals” or “Semi-Casual”. We don’t take things super seriously and strongly believe that real life comes first. There are no expectations of x amount of hours or days you must log in on.
		</p>
		<p>
			But when we do get together we’re aiming to get better at the game, so if we’re doing a mission or an operation we’ll try to work on things like comms discipline and skilling up in our chosen game areas.
		</p>
	</HeroImg>
	<HeroImg
		src={placeholder}
		position="top-left"
	>
		<HeroTitle>How is the Org Structured?</HeroTitle>
		<p>
			We don’t want people to feel too wedded to a specific area of the game at this point, so when we run org-wide ops or events with the community, any member is free to sign-up for any type of gameplay.
		</p>
		<p>
			However, we also have “Wings” which members are free to sign up for. The Wings are usually more specific and will focus on a particular area of gameplay like Industry or Combat. Some of the Wings are also a little more hardcore allowing us to cater to those players who want to take things a bit more seriously!
		</p>
	</HeroImg>
	<HeroImg
		src={placeholder}
		position="top-right"
	>
		<HeroTitle>What are your goals?</HeroTitle>
		<p>
			Right now we are just trying to get better at the game, and develop good ways to coordinate large groups of players in the verse. We’re also focussed on the most important things – having a tonne of fun!
		</p>
		<p>
			Long term we want to be a force helping to shape Star Citizen’s end game, building a powerhouse of an Organisation that can achieve world firsts, protect one another and carve out our own territory in the verse – all without ever stomping on the little guys!
		</p>
	</HeroImg>
</section>