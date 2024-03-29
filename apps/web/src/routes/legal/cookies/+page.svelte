<script lang="ts">
import { A, Li, List, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from "flowbite-svelte";

	import { Hr } from "$lib/components";
	import { DISCORD_URL } from "$lib/constants";

	import LegalSection from "../LegalSection.svelte";
	import LegalSectionWrapper from "../LegalSectionWrapper.svelte";
	import LegalTitle from "../LegalTitle.svelte";
</script>

<svelte:head>
    <title>Cookie Policy - Legal | Frontier Consolidated</title>
</svelte:head>

<LegalTitle>Cookie Policy</LegalTitle>
<p class="font-medium text-gray-400">Last updated January 30, 2024</p>
<Hr class="my-8" />
<LegalSectionWrapper>
    <LegalSection>
        <p>
            This Cookie Policy explains how Frontier Consolidated ("Organisation," "we," "us," and "our") uses cookies and similar technologies to recognize you when you visit our website at <A aClass="hover:underline" href="https://frontierconsolidated.com">https://frontierconsolidated.com</A> ("Website"). It explains what these technologies are and why we use them, as well as your rights to control our use of them.
        </p>
        <p>
            In some cases we may use cookies to collect personal information, or that becomes personal information if we combine it with other information.
        </p>
    </LegalSection>
    <LegalSection title="What are cookies?">
        <p>
            Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
        </p>
        <p>
            Cookies set by the website owner (in this case, Frontier Consolidated) are called "first-party cookies." Cookies set by parties other than the website owner are called "third-party cookies." Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., advertising, interactive content, and analytics). The parties that set these third-party cookies can recognize your computer both when it visits the website in question and also when it visits certain other websites.
        </p>
    </LegalSection>
    <LegalSection title="Why do we use cookies?">
        <p>
            We use first- and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Online Properties. Third parties serve cookies through our Website for advertising, analytics, and other purposes. This is described in more detail below.
        </p>
    </LegalSection>
    <LegalSection title="How can I control cookies?">
        <p>
            You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in the Cookie Consent Manager. The Cookie Consent Manager allows you to select which categories of cookies you accept or reject. Essential cookies cannot be rejected as they are strictly necessary to provide you with services.
        </p>
        <p>
            The Cookie Consent Manager can be found in the footer on our website. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted. You may also set or amend your web browser controls to accept or refuse cookies.
        </p>
        <p>
            The specific types of first- and third-party cookies served through our Website and the purposes they perform are described in the table below (please note that the specific cookies served may vary depending on the specific Online Properties you visit):
        </p>
        <Table>
            <TableHead>
                <TableHeadCell class="w-32">
                    Cookie type
                </TableHeadCell>
                <TableHeadCell class="w-48">
                    Cookie name
                </TableHeadCell>
                <TableHeadCell class="w-32">
                    Duration
                </TableHeadCell>
                <TableHeadCell>
                    Purpose
                </TableHeadCell>
            </TableHead>
            <TableBody>
                <TableBodyRow>
                    <TableBodyCell>
                        First-party
                    </TableBodyCell>
                    <TableBodyCell>
                        frcn.consent
                    </TableBodyCell>
                    <TableBodyCell>
                        400 days
                    </TableBodyCell>
                    <TableBodyCell>
                        Keeps track of the cookie consent options you have selected
                    </TableBodyCell>
                </TableBodyRow>
                <TableBodyRow>
                    <TableBodyCell>
                        First-party
                    </TableBodyCell>
                    <TableBodyCell>
                        frcn.sid
                    </TableBodyCell>
                    <TableBodyCell>
                        12 hours
                    </TableBodyCell>
                    <TableBodyCell>
                        To keep track of your current login session
                    </TableBodyCell>
                </TableBodyRow>
                <TableBodyRow>
                    <TableBodyCell>
                        First-party
                    </TableBodyCell>
                    <TableBodyCell>
                        frcn.deviceid
                    </TableBodyCell>
                    <TableBodyCell>
                        1 year
                    </TableBodyCell>
                    <TableBodyCell>
                        Identifies your current device on our site so we can keep track of where you are logged in
                    </TableBodyCell>
                </TableBodyRow>
            </TableBody>
        </Table>
    </LegalSection>
    <LegalSection title="How can I control cookies on my browser?">
        <p>
            As the means by which you can refuse cookies through your web browser controls vary from browser to browser, you should visit your browser's help menu for more information. The following is information about how to manage cookies on the most popular browsers:
        </p>
        <List tag="ul">
            <Li>
                <A aClass="hover:underline" href="https://support.google.com/chrome/answer/95647#zippy=%2Callow-or-block-cookies">Chrome</A>
            </Li>
            <Li>
                <A aClass="hover:underline" href="https://support.microsoft.com/en-us/windows/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d">Internet Explorer</A>
            </Li>
            <Li>
                <A aClass="hover:underline" href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop?redirectslug=enable-and-disable-cookies-website-preferences&redirectlocale=en-US">Firefox</A>
            </Li>
            <Li>
                <A aClass="hover:underline" href="https://support.apple.com/en-ie/guide/safari/sfri11471/mac">Safari</A>
            </Li>
            <Li>
                <A aClass="hover:underline" href="https://support.microsoft.com/en-us/windows/microsoft-edge-browsing-data-and-privacy-bb8174ba-9d73-dcf2-9b4a-c582b4e640dd">Edge</A>
            </Li>
            <Li>
                <A aClass="hover:underline" href="https://help.opera.com/en/latest/web-preferences/">Opera</A>
            </Li>
        </List>
        <p>
            In addition, most advertising networks offer you a way to opt out of targeted advertising. If you would like to find out more information, please visit:
        </p>
        <List tag="ul">
            <Li>
                <A aClass="hover:underline" href="https://optout.aboutads.info/?c=2&lang=EN">Digital Advertising Alliance</A>
            </Li>
            <Li>
                <A aClass="hover:underline" href="https://youradchoices.ca/">Digital Advertising Alliance of Canada</A>
            </Li>
            <Li>
                <A aClass="hover:underline" href="https://www.youronlinechoices.com/">European Interactive Digital Advertising Alliance</A>
            </Li>
        </List>
    </LegalSection>
    <LegalSection title="What about other tracking technologies, like web beacons?">
        <p>
            Cookies are not the only way to recognize or track visitors to a website. We may use other, similar technologies from time to time, like web beacons (sometimes called "tracking pixels" or "clear gifs"). These are tiny graphics files that contain a unique identifier that enables us to recognize when someone has visited our Website or opened an email including them. This allows us, for example, to monitor the traffic patterns of users from one page within a website to another, to deliver or communicate with cookies, to understand whether you have come to the website from an online advertisement displayed on a third-party website, to improve site performance, and to measure the success of email marketing campaigns. In many instances, these technologies are reliant on cookies to function properly, and so declining cookies will impair their functioning.
        </p>
    </LegalSection>
    <LegalSection title="Do you serve targeted advertising?">
        <p>
            Third parties may serve cookies on your computer or mobile device to serve advertising through our Website. These companies may use information about your visits to this and other websites in order to provide relevant advertisements about goods and services that you may be interested in. They may also employ technology that is used to measure the effectiveness of advertisements. They can accomplish this by using cookies or web beacons to collect information about your visits to this and other sites in order to provide relevant advertisements about goods and services of potential interest to you. The information collected through this process does not enable us or them to identify your name, contact details, or other details that directly identify you unless you choose to provide these.
        </p>
    </LegalSection>
    <LegalSection title="How often will you update this Cookie Policy?">
        <p>
            We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. Please therefore revisit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
        </p>
        <p>
            The date at the top of this Cookie Policy indicates when it was last updated.
        </p>
    </LegalSection>
    <LegalSection title="Where can I get further information?">
        <p>If you have any questions about our use of cookies or other technologies, please contact us at:</p>
        <p><A aClass="hover:underline" href={DISCORD_URL}>{DISCORD_URL.split("://")[1]}</A></p>
    </LegalSection>
</LegalSectionWrapper>