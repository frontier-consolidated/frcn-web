<script lang="ts">
	import { Heading } from "flowbite-svelte";

	import Hr from "$lib/components/Hr.svelte";
	import image1 from "$lib/images/stock/activities/1.png"
	import image2Desktop from "$lib/images/stock/activities/2-desktop.jpg"
	import image2Mobile from "$lib/images/stock/activities/2-mobile.jpg"
	import image3Desktop from "$lib/images/stock/activities/3-desktop.jpg"
	import image3Mobile from "$lib/images/stock/activities/3-mobile.jpg"
	import image4 from "$lib/images/stock/activities/4.jpg"
	import image5 from "$lib/images/stock/activities/5.png"
	import image6 from "$lib/images/stock/activities/6.jpg"
	import image7 from "$lib/images/stock/activities/7.jpg"
	import image8 from "$lib/images/stock/activities/8.png"
	import image9 from "$lib/images/stock/activities/9.png"
	import placeholder from "$lib/images/stock/placeholder.jpg"

	import HeroImg from "../HeroImg.svelte";
	import HeroTitle from "../HeroTitle.svelte";
</script>

<svelte:head>
	<title>About - Our Activities</title>
</svelte:head>

<Heading tag="h1" class="font-medium text-4xl">Frontier Activities</Heading>
<p class="text-gray-400">Be a part of something great</p>
<Hr />
<section class="mt-2 flex flex-col gap-8">
	<HeroImg
		src={image1}
		position="bottom-left"
	>
		<HeroTitle>Better together</HeroTitle>
		<p>
			It's dangerous to go alone. Bring a friend - or many!
		</p>
		<p>
			Everything about Star Citizen is large - the scope, the space, the community, and the potential for both 
			profit and disaster. In either case, it's better enjoyed with others. By all means, we all need a break and 
			to cruise the void in solitude from time to time. But just the same, returning to your home base laden 
			with fresh aUEC, ready for planning your next move with your buddies, will taste all the more sweet.
		</p>
		<p>
			Fortune and misfortune are both best savored with company. If nothing else, your friends might save 
			your ass one day you screw up really badly.
		</p>
	</HeroImg>
	<HeroImg
		src={image2Mobile}
		sources={{
			md: image2Desktop
		}}
		position="bottom-left"
	>
		<HeroTitle>Combined Ops</HeroTitle>
		<p>
			For many of FRCNs ops, industry is often either the focus or an important part, but far from always.
		</p>
		<p>
			Larger events can easily have over 50 players in total, consisting of HQ, mining, salvage, logistics, 
			support and combat wings. There are plenty of roles to fill and not having certain ships or equipment 
			does not prevent you from participating.
		</p>
	</HeroImg>
	<HeroImg
		src={image3Mobile}
		sources={{
			md: image3Desktop
		}}
		position="top-right"
	>
		<HeroTitle>That's mine!</HeroTitle>
		<p>
			FRCN also runs community mining events, where we train how to mine in Star Citizen. Everyone's 
			welcome, from first-timers to seasoned veterans. If you don't own a mining vehicle or suitable ship, we 
			can usually find a seat for you in one of ours, or help you rent one.
		</p>
		<p>
			Our "Casual midweek mining" events are exactly as the name implies. Focus is on enjoying our time, 
			while at the same time learning to be a part of a team and play as a larger group. From captaining a ship, 
			piloting, mining turret operator to scout pilot and security - all are equally important during an event, 
			and profits are shared equally.
		</p>
	</HeroImg>
	<HeroImg
		src={image4}
	>
		<HeroTitle>Salvage the situation</HeroTitle>
		<p>
			The dangers of the 'verse leaves a lot of bounty available for the taking, sometimes from other people. 
			Whether it's recycled hull material, components or less legal goodies, FRCN collects it all.
		</p>
		<p>
			Whether you'd like to pilot a Vulture or Reclaimer, or operate a salvage turret or a tractor beam - or 
			even be a cargo deck box monkey - FRCN can put you to good use cleaning up the spaceways. And if 
			there isn't enough debris, we can always make more.
		</p>
	</HeroImg>
	<HeroImg
		src={image5}
		position="top-left"
	>
		<HeroTitle>Combat</HeroTitle>
		<p>
			FRCN offers a unique blend of camaraderie, strategy, and action for players looking to delve into the 
			game's combat aspects, without the pressure of hardcore commitment, and provides a supportive 
			environment where casual players can learn, grow, and contribute at their own pace.
		</p>
		<p>
			Whether you like the precision and teamwork of assault operations with the Legion, the grand scale of 
			space engagements with the Navy, with FRCN you can experience Star Citizen's combat scenarios, from 
			bounty hunting to safeguarding valuable assets, all while being part of a group that values cooperation, 
			mutual respect, and the sheer joy of playing together.
		</p>
	</HeroImg>
	<HeroImg
		src={image6}
		position="top-right"
	>
		<HeroTitle>Working together</HeroTitle>
		<p>
			The 'verse is dark and full of dangers, but also full of fun to be had with a group of players, large or 
			small. Star Citizen is made to be played with others and has a vast scope of opportunities for gameplay 
			beyond the solo player.
		</p>
		<p>
			While it's easy to gather a friend or two for some quality time exploring the 'verse, crewing up for a 
			larger ship or more complex operation can be more demanding and may require skills in coordination, 
			logistics and the general herding of cats. That's where FRCN can help.
		</p>
	</HeroImg>
	<HeroImg
		src={image7}
		position="top-left"
	>
		<HeroTitle>Velocity squared</HeroTitle>
	</HeroImg>
	<HeroImg
		src={image8}
		position="top-right"
	>
		<HeroTitle>Sample op 1</HeroTitle>
	</HeroImg>
	<HeroImg
		src={image9}
		position="bottom-left"
	>
		<HeroTitle>Sample op 2</HeroTitle>
	</HeroImg>
</section>