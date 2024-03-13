<script lang="ts">
	import { browser } from "$app/environment";
	import { A, Button, Modal } from "flowbite-svelte";
	import { queryParam } from "sveltekit-search-params";

	import { Routes, api } from "$lib/api";
	import { cookieConsentModal } from "$lib/stores/CookieConsentModalStore";

    const missingConsent = browser ? queryParam("missing_consent") : null

    function cleanup() {
        if ($missingConsent) {
            missingConsent!.set(null)
        }
        if ($cookieConsentModal) {
            cookieConsentModal.set(false)
        }
    }

    async function updateConsent(action: "reject" | "necessary" | "all") {
        await api.put(Routes.consent(), {
            action
        })

        cleanup()
    }
</script>

<Modal id="cookie-consent-modal" dismissable={!$missingConsent} outsideclose={!$missingConsent} open={!!$missingConsent || $cookieConsentModal} placement="bottom-center" class="clip-opposite-8 rounded" bodyClass="space-y-2 px-10" size="lg" on:close={() => {
    cleanup()
}}>
    <span class="font-medium text-xl text-gray-800 dark:text-white">We use cookies</span>
    <p>
        We use cookies to enhance site functionality, improve your site experience and track your current login session. You may accept or reject by clicking below or at anytime by clicking 'Manage Cookies' in the footer of any page. <A aClass="hover:underline" href="/legal/cookies">Read our Cookie Policy</A>
    </p>
    <div class="flex flex-wrap gap-4 pt-4">
        <Button class="w-full md:flex-1 rounded-none clip-opposite-4" on:click={() => {
            updateConsent("all").catch(console.error)
        }}>
            Accept all cookies
        </Button>
        <Button class="w-full md:flex-1 rounded-none clip-opposite-4" on:click={() => {
            updateConsent("necessary").catch(console.error)
        }}>
            Necessary cookies only
        </Button>
        <Button class="group/reject w-full md:flex-1 rounded-none clip-opposite-4 p-px text-primary-700 hover:text-white hover:bg-primary-700 dark:hover:bg-primary-600" on:click={() => {
            updateConsent("reject").catch(console.error)
        }}>
            <div class="w-full clip-opposite-4 px-5 py-2.5 bg-white dark:bg-gray-800 group-hover/reject:bg-primary-700 dark:group-hover/reject:bg-primary-600">
                Reject all cookies
            </div>
        </Button>
    </div>
</Modal>