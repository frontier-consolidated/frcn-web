import fs from "fs"

import { chromium } from "playwright"

function waitFor(ms) {
    return new Promise(resolve => {
        setTimeout(() => resolve(), ms)
    })
}

(async () => {
    const browser = await chromium.launch();

    const page = await browser.newPage()
    await page.goto("https://robertsspaceindustries.com/ship-matrix")

    await page.waitForLoadState("networkidle")
    await page.click("#allow-all")
    await waitFor(8000)

    const shipLocators = await page.locator("#shipscontainer > .ship").all()
    const ships = []
    for (const locator of shipLocators) {
        const name = await locator.locator(".statbox.title > p").first().innerHTML()
        console.log(name)
        const pageLink = await locator.locator(".actionscontainer > .statbox > a").first().getAttribute("href") // shipDiv.querySelector(".actionscontainer > .statbox > a").href;

        const shipPage = await browser.newPage()
        await shipPage.goto("https://robertsspaceindustries.com" + pageLink)

        // eslint-disable-next-line no-inner-declarations
        async function getPrice() {
            let price = "unknown"
            try {
                price = await shipPage.locator(".price > .final-price").first().getAttribute("data-value", {
                    timeout: 500
                })
            } catch (err) {
                //
            }
            return price
        }

        const gdp = await getPrice()

        await shipPage.close()

        ships.push({
            name,
            gdp
        })
    }

    await page.close()
    await browser.close()

    const shiplist = ships.map(ship => `${ship.name}: £${ship.gdp.slice(0, -2)}.${ship.gdp.slice(-2)}`).join("\n")
    fs.writeFileSync("ship_pledge_prices.txt", shiplist)
})()