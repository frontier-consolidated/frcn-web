<script lang="ts">
	import { Button, Heading, Li, List } from "flowbite-svelte";
	import { DiscordSolid } from "flowbite-svelte-icons";

	import Hr from "$lib/components/Hr.svelte";
	import { DISCORD_URL } from "$lib/constants";
	import image1 from "$lib/images/stock/community/1.jpg"
	import image2 from "$lib/images/stock/community/2.jpg"
	import image3 from "$lib/images/stock/community/3.jpg"
	import image4 from "$lib/images/stock/community/4.png"
	import image5 from "$lib/images/stock/community/5.jpg"
	import image6 from "$lib/images/stock/community/6.png"
	import image7 from "$lib/images/stock/community/7.jpg"

	import HeroImg from "../HeroImg.svelte";
	import HeroTitle from "../HeroTitle.svelte";
</script>

<svelte:head>
	<title>About - Our Community</title>
</svelte:head>

<Heading tag="h1" class="font-medium text-4xl">Frontier Community</Heading>
<p class="text-gray-400">Be a part of something great</p>
<Hr />
<section class="mt-2 flex flex-col gap-8">
	<HeroImg
		src={image1}
		position="top-left"
	>
		<HeroTitle>How do I join the community?</HeroTitle>
		<p>
			Just hop on into our Discord and say hello. No need to ask permission to join a conversation. If you can see it, you can join it.
		</p>
		<div class="flex-1 flex items-end justify-center">
			<Button size="lg" class="text-white bg-discord-500 dark:bg-discord-500 dark:hover:bg-discord-200" href={DISCORD_URL}>
				<DiscordSolid class="me-2" /> Join our Discord
			</Button>
		</div>
	</HeroImg>
	<HeroImg
		src={image2}
	>
		<HeroTitle>Do I need to join your Org?</HeroTitle>
		<p>
			No, absolutely not.
		</p>
		<p>
			While we're building an org we think it's just as important to give people a taste of multiplayer action 
			without any requirement to fly under our banner. The Frontier Community is open to all who can follow 
			our pretty straightforward rules, and we run a tonne of events where everyone is welcome.
		</p>
	</HeroImg>
	<HeroImg
		src={image3}
		position="bottom-left"
	>
		<HeroTitle>Why should I join?</HeroTitle>
		<p>
			Star Citizen in its current form is a fantastic game that can deliver a good amount of hours of gameplay 
			for a solo player. But where it really shines right now is as a sandbox to allow people to come together. 
			Playing as a group can also really help when the inevitable bugs hit - maybe you'll have buddies to pick 
			you up, or at the very least you'll have friends to laugh about it with.
		</p>
	</HeroImg>
	<HeroImg
		src={image4}
	>
		<HeroTitle>I'm brand new to Star Citizen, can I join?</HeroTitle>
		<p>
			Yes, you can.
		</p>
		<p>
			One of the things we pride ourselves on at Frontier is teaching new players the ropes. Star Citizen has a 
			pretty steep learning curve, but a little bit of direct help and guidance can go a long way. Our members 
			are happy to help new players take their first steps in the 'verse and we have some extremely skilled 
			players who are able to help you progress.
		</p>
	</HeroImg>
	<HeroImg
		src={image5}
		position="top-left"
	>
		<HeroTitle>What types of gameplay do you cover?</HeroTitle>
		<p>
			We try to do a bit of everything that Star Citizen has to offer; from industrial to combat to racing and 
			beyond. We also run various semi-scripted events to simulate some loops which aren't firmly in game 
			like exploration and medical rescue.
		</p>
		<p>
			One thing we don't actively pursue is piracy - we still welcome players who like a bit of "piratey" action 
			into the community since we think it's really cool to have a melting pot where all types of players can 
			get together. Just don't expect any pirate themed events other than some training simulations. 
		</p>
	</HeroImg>
	<HeroImg
		src={image6}
		position="top-left"
	>
		<HeroTitle>Where are your members from?</HeroTitle>
		<p>
			In both the community and the org we are proud to have a truly multinational community with players 
			from all over the world. When it comes to server selection for group events we'll tend to prioritise the 
			best ping for the greatest number, but to be honest ping is often secondary to desync in Star Citizen.
		</p>
		<p>
			In terms of language English is the primary spoken language in the community, but if English is a second 
			language for you, please don't worry or be self-conscious about it. Chances are we have members who 
			speak your mother tongue who will be able to help you out. 
		</p>
	</HeroImg>
	<HeroImg
		src={image7}
		position="top-right"
	>
		<HeroTitle>Play nice!</HeroTitle>
		<p>
			A few important things to remember:
		</p>
		<List tag="ol" position="outside" class="pl-4">
			<Li>
				<strong>Remember it's a game</strong>. We are all here to have fun.
			</Li>
			<Li>
				<strong>Be considerate</strong>. Don't let your fun ruin someone else's. Feel free to join any chat you can see, 
				but be mindful of what's going on there. 
			</Li>
			<Li>
				<strong>Keep comms clean</strong>. During events and operations, be brief and concise, and keep to the topic. 
				As for the other meaning of "clean", remember that there are minors in the FRCN community, 
				even though we practice a 16 year age limit.
			</Li>
			<Li>
				<strong>Ask for help if you need it</strong>. We take pride in helping people up the steep learning curve that is 
				Star Citizen, so don't be afraid to ask for assistance or instructions.
			</Li>
		</List>
	</HeroImg>
</section>