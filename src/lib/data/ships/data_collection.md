Go to: https://robertsspaceindustries.com/ship-matrix

Run:
```js
const ships = Array.from(document.querySelectorAll("#shipscontainer > .ship")).map((shipDiv) => { const name = shipDiv.querySelector(".statbox.title > p").innerHTML; const manufacturer = shipDiv.querySelector(".statbox.manufacturer > p").innerHTML; const img = shipDiv.querySelector(".shipimg > img").src; const roles = shipDiv.querySelector(".statbox.role > p").innerHTML.split("/").map(r => r.trim()); let cargo = Number(shipDiv.querySelector(".statbox.cargocapacity > p").innerHTML); if (isNaN(cargo)) cargo = 0; return { name, manufacturer, img, roles, cargo } }); const data = { ships, roles: Array.from(new Set(ships.reduce((roles, ship) => [...roles, ...ship.roles], []))), manufacturers: Array.from(new Set(ships.reduce((manufacturers, ship) => [...manufacturers, ship.manufacturer], []))) }; data;
```

Copy the object into `ships.json`