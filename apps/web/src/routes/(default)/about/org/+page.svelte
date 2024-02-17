<script lang="ts">
	import { Heading } from "flowbite-svelte";

	import Hr from "$lib/components/Hr.svelte";
	import image1 from "$lib/images/stock/org/1.jpg"
	import image2 from "$lib/images/stock/org/2.jpg"
	import image3 from "$lib/images/stock/org/3.jpg"
	import image4 from "$lib/images/stock/org/4.jpg"
	import image5 from "$lib/images/stock/org/5.jpg"
	import image6 from "$lib/images/stock/org/6.jpg"

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
		position="bottom-right"
	>
		<HeroTitle>Welcome to the org!</HeroTitle>
		<p>
			Frontier Consolidated is our Star Citizen organisation and we are actively recruiting new members. 
			We cover nearly all areas of the game and are open to everyone once they have got the basics of the 
			game down. And if you're not quite there yet, the community is there to help you get to that point.
		</p>
	</HeroImg>
	<HeroImg
		src={image2}
		position="bottom-left"
	>
		<HeroTitle>What areas of the game do you cover?</HeroTitle>
		<p>
			Much like in the Frontier Community. Frontier Consolidated aims to be a broad church group covering a 
			wide array of gameplay. We think we can create an org of people that support and complement one 
			another mixing players who love different areas of the game, such as industry, combat, logistics, 
			support, exploration, racing, and so on.
		</p>
		<p>
			Just like in the Frontier Community, piracy gameplay is best avoided. It's still early days for Star Citizen, 
			but we think that player organisations are already developing reputations. We don't want ours to be 
			associated with holding other players up at gunpoint.
		</p>
	</HeroImg>
	<HeroImg
		src={image3}
		position="bottom-right"
	>
		<HeroTitle>How do I join?</HeroTitle>
		<p>
			While we have grown to a decent size, our goal has always been to keep a small org feel. The most 
			important thing for us is that our members actually know each other and play together.
		</p>
		<p>
			Any Frontier Community member can flag themselves as a prospect in the discord, and from that point 
			you'll just need to get two references from org members you know and preferably have played with. 
			You can hop into a discord voice channel and say hi at any time, but we have plenty of events where 
			we'll specifically pair up prospects with org members to help you out.
		</p>
	</HeroImg>
	<HeroImg
		src={image4}
	>
		<HeroTitle>How seriously do you take the game?</HeroTitle>
		<p>
			Overall we would describe ourselves as "filthy casuals" or "semi-casual". We don't take things super 
			seriously and strongly believe that real life comes first. There are no expectations of X amount of hours 
			or days you must log in on.
		</p>
		<p>
			But when we do get together we're aiming to get better at the game, so if we're doing a mission or an 
			operation we'll try to work on things like communication discipline and skilling up in our chosen game 
			areas.
		</p>
	</HeroImg>
	<HeroImg
		src={image5}
		position="top-left"
	>
		<HeroTitle>How is the org structured?</HeroTitle>
		<p>
			We don't want people to feel too wedded to a specific area of the game at this point, so when we run 
			org-wide operations or events with the community, any member is free to sign up for up for any type of 
			gameplay.
		</p>
		<p>
			However, we also have "wings" which members are free to sign up for. The wings are usually more 
			specific and and will focus on a particular area of gameplay like industry or combat. Some of the wings 
			are also a little more hardcore, allowing us to cater to those players who want to take things a bit more 
			seriously.
		</p>
	</HeroImg>
	<HeroImg
		src={image6}
		position="top-right"
	>
		<HeroTitle>What are your goals?</HeroTitle>
		<p>
			Right now we are just trying to get better at the game and develop good ways to coordinate large 
			groups of players in the verse. We're also focused on the most important things - like having a tonne of 
			fun!
		</p>
		<p>
			Long term, we want to be a force helping to shape Star Citizen's end game, building a powerhouse of an 
			organisation that can achieve world firsts, protect one another and carve out our own territory in the 
			verse. All without ever stomping on the little guys.
		</p>
</HeroImg>
</section>