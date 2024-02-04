<script lang="ts">
	import { Heading } from "flowbite-svelte";

	import Hr from "$lib/components/Hr.svelte";
	import miningImage from "$lib/images/stock/activities/mining.jpg"
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
		src={placeholder}
		position="top-left"
	>
		<HeroTitle>Better together</HeroTitle>
	</HeroImg>
	<HeroImg
		src={placeholder}
		position="top-right"
	>
		<HeroTitle>Combined Ops</HeroTitle>
	</HeroImg>
	<HeroImg
		src={miningImage}
		position="bottom-left"
	>
		<HeroTitle>Community Mining Events</HeroTitle>
		<p>
			We run community mining events, where we train you how to mine in Star Citizen. Our Casual Midweek Mining events are exactly as the name implies. Casual mining together, in a group.
		</p>
		<p>
			The focus is on enjoying our time, while at the same time learning to be a part of a team and a larger group. There's roles from captaining a ship, piloting, mining turret operator to scout pilot and security and all are equally important during the event.
		</p>
		<p>
			All earnings made during the community events are split equally between all participants since all participants are investing their time into the event equally.
		</p>
	</HeroImg>
	<HeroImg
		src={placeholder}
	>
		<HeroTitle>Combat Events</HeroTitle>
	</HeroImg>
	<HeroImg
		src={placeholder}
	>
		<HeroTitle>Multi Crew</HeroTitle>
	</HeroImg>
	<HeroImg
		src={placeholder}
		position="top-left"
	>
		<HeroTitle>Sample Op 1</HeroTitle>
	</HeroImg>
	<HeroImg
		src={placeholder}
		position="top-right"
	>
		<HeroTitle>Sample Op 2</HeroTitle>
	</HeroImg>
</section>