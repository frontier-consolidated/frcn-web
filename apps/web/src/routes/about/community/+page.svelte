<script lang="ts">
	import { Button, Heading, Li, List } from "flowbite-svelte";
	import { DiscordSolid } from "flowbite-svelte-icons";

	import { JoinDiscordButton } from "$lib/components";
	import { DISCORD_URL } from "$lib/constants";
	import image1Desktop from "$lib/images/stock/community/1-desktop.jpg"
	import image1Mobile from "$lib/images/stock/community/1-mobile.jpg"
	import image2Desktop from "$lib/images/stock/community/2-desktop.jpg"
	import image2Mobile from "$lib/images/stock/community/2-mobile.jpg"
	import image3 from "$lib/images/stock/community/3.jpg"
	import image4Desktop from "$lib/images/stock/community/4-desktop.png"
	import image4Mobile from "$lib/images/stock/community/4-mobile.png"
	import image5Desktop from "$lib/images/stock/community/5-desktop.jpg"
	import image5Mobile from "$lib/images/stock/community/5-mobile.jpg"
	import image6 from "$lib/images/stock/community/6.png"
	import image7Desktop from "$lib/images/stock/community/7-desktop.jpg"
	import image7Mobile from "$lib/images/stock/community/7-mobile.jpg"
	import heroImageFallback from "$lib/images/stock/community/hero.png"
	import heroImageSrcset from "$lib/images/stock/community/hero.png?w=500;900;1200;1600;2000&format=webp&as=srcset&imagetools"

	import AboutHero from "../AboutHero.svelte";
	import AboutSection from "../AboutSection.svelte";
</script>

<svelte:head>
	<title>Our Community - About | Frontier Consolidated</title>
</svelte:head>

<AboutHero
	srcset={heroImageSrcset}
	fallback={heroImageFallback}
>
	<Heading tag="h1" class="text-white font-medium text-4xl sm:text-5xl drop-shadow-md">Frontier Community</Heading>
	<p class="text-slate-400 drop-shadow-md">Be a part of something great</p>
</AboutHero>
<section class="mt-2 flex flex-col gap-8 p-4 w-full max-w-6xl mx-auto">
	<AboutSection
		title="How do I join the community?"
		src={image1Mobile}
		sources={{
			md: image1Desktop,
		}}
		position="top-right"
	>
		<p>
			Just hop on into our Discord and say hello. No need to ask permission to join a conversation. If you can 
			see it, you can join it. Just read the room and don't talk over ops comms, if one is ongoing.
		</p>
		<div class="flex-1 flex items-end justify-center">
			<JoinDiscordButton />
		</div>
	</AboutSection>
	<AboutSection
		title="Do I need to join your Org?"
		src={image2Mobile}
		sources={{
			md: image2Desktop,
		}}
		position="top-left"
	>
		<p>
			No, absolutely not.
		</p>
		<p>
			While we're building an org, we think it's just as important to give people a taste of multiplayer action 
			without any requirement to fly under our banner. The Frontier Community is open to all who can follow 
			our pretty straightforward rules, and we run a tonne of events where everyone is welcome.
		</p>
	</AboutSection>
	<AboutSection
		title="Why should I join?"
		src={image3}
		position="bottom-left"
	>
		<p>
			Star Citizen in its current form is a fantastic game that can deliver a hours of gameplay for a solo player. 
			Where it really shines right now, though, is as a sandbox to allow people to come together. Playing as a 
			group can also really help when the inevitable bugs hit - maybe you'll have buddies to pick you up, or at 
			the very least you'll have friends to laugh about it with.
		</p>
	</AboutSection>
	<AboutSection
		title="I'm brand new to Star Citizen, can I join?"
		src={image4Mobile}
		sources={{
			md: image4Desktop,
		}}
		position="bottom-left"
	>
		<p>
			Yes, you can.
		</p>
		<p>
			One of the things we pride ourselves on at Frontier is teaching new players the ropes. Star Citizen has a 
			pretty steep learning curve, but a little bit of direct help and guidance can go a long way. Our members 
			are happy to help new players take their first steps in the 'verse and we have some extremely skilled 
			players who are able to help you progress.
		</p>
	</AboutSection>
	<AboutSection
		title="What types of gameplay do you cover?"
		src={image5Mobile}
		sources={{
			md: image5Desktop,
		}}
		position="top-right"
	>
		<p>
			We try to do a bit of everything that Star Citizen has to offer; from industrial to combat to racing and 
			beyond. We also run various semi-scripted events to simulate some loops which aren't firmly in game 
			like exploration and medical rescue.
		</p>
		<p>
			One thing we don't actively pursue is piracy, but we still welcome players who like a bit of "piratey" 
			action into the community since we think it's really cool to have a melting pot where all types of players 
			can get together. Just don't expect any pirate themed events other than some training simulations.
		</p>
	</AboutSection>
	<AboutSection
		title="Where are your members from?"
		src={image6}
		position="bottom-left"
	>
		<p>
			We are proud to have a truly multinational community with players from all over the world. 
			English is the primary spoken language in the community, but if English is a second language for you, 
			please don't worry or be self-conscious about it. Chances are we have members who speak your mother 
			tongue who will be able to help you out.
		</p>
	</AboutSection>
	<AboutSection
		title="Play nice!"
		src={image7Mobile}
		sources={{
			md: image7Desktop,
		}}
		position="top-right"
	>
		<p>
			A few important things to remember:
		</p>
		<List tag="ol" position="outside" class="pl-4">
			<Li>
				<strong>Remember it's a game</strong>. We are all here to have fun.
			</Li>
			<Li>
				<strong>Be considerate</strong>. Don't let your fun ruin someone else's, but feel free to join any chat you can 
				see.
			</Li>
			<Li>
				<strong>Keep comms clean</strong>. During events and operations, be brief and concise, and keep to the topic. 
				Remember also that there are minors in the FRCN community, even though there is a 16 year 
				age limit.
			</Li>
			<Li>
				<strong>Ask for help if you need it</strong>. We take pride in helping people up the steep learning curve that is 
				Star Citizen, so don't be afraid to ask for assistance or instructions.
			</Li>
		</List>
	</AboutSection>
</section>